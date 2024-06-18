<template>
  <div class="search-container">
    <div class="input-group position-relative">
      <input
        class="form-control search-input"
        type="search"
        placeholder="Search"
        aria-label="Search"
        v-model="search"
        @keyup="handleSearchKeyup"
        @focus="showSuggestions = true"
        @blur="hideSuggestions"
      />
      <ul
        v-if="showSuggestions && filteredSuggestions.length"
        class="suggestions-list"
      >
        <li
          v-for="suggestion in filteredSuggestions"
          :key="suggestion"
          @mousedown.prevent="selectSuggestion(suggestion)"
        >
          {{ suggestion }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { debounce } from "lodash"; // Import lodash debounce

export default {
  name: "SearchBar",
  data() {
    return {
      search: this.$route.query.search || "",
      showSuggestions: false,
    };
  },
  computed: {
    suggestions() {
      // Debugging log
      if (this.$root.store.lastSearch?.query?.length > 3) {
        console.log(
          "Adding last search query:",
          this.$root.store.lastSearch.query
        );
        this.$root.store.previousSearches.add(
          this.$root.store.lastSearch.query
        );
      }
      console.log(
        "Previous searches:",
        Array.from(this.$root.store.previousSearches)
      );
      return Array.from(this.$root.store.previousSearches);
    },
    filteredSuggestions() {
      const lowerCaseSearch = this.search.toLowerCase();
      const filtered = this.suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(lowerCaseSearch)
      );
      // Debugging log
      console.log("Filtered suggestions:", filtered);
      return filtered;
    },
  },
  methods: {
    debounceSearch: debounce(function() {
      this.onSearch();
    }, 300), // Debounce for 300ms

    longerDebounceSearch: debounce(function() {
      if (this.search.length > 3) {
        // Only add search term if it's longer than 3 characters
        this.$root.store.previousSearches.add(this.search); // Add search term to previous searches
      }
    }, 1000), // Debounce for 3000ms (3 seconds)

    handleSearchKeyup(event) {
      this.$root.toast(
        "Search keyup event",
        "this is the body of the toast",
        "success"
      );
      if (event.key === "Enter") {
        this.onSearch();
        this.$root.store.previousSearches.add(this.search);
        // Debugging log
        console.log("Search term added:", this.search);
      } else if (event.key === "Backspace" || event.key === "Delete") {
        this.updateQueryString();
        this.showSuggestions = true;
      } else {
        this.showSuggestions = true;
      }
    },

    selectSuggestion(suggestion) {
      this.search = suggestion;
      this.showSuggestions = false;
      this.onSearch();
    },

    hideSuggestions() {
      setTimeout(() => {
        this.showSuggestions = false;
      }, 200); // Delay hiding to allow click event to register
    },

    updateQueryString() {
      const newQuery = { ...this.$route.query, search: this.search };
      this.$router.push({ query: newQuery }).catch(() => {});
    },

    onSearch() {
      if (this.search.length > 3 || this.search.length === 0) {
        const newQuery = { search: this.search };
        const currentQuery = this.$route.query;

        const isQueryDifferent = Object.keys(newQuery).some(
          (key) => newQuery[key] !== currentQuery[key]
        );

        if (isQueryDifferent) {
          this.$router
            .push({ name: "search", query: newQuery })
            .catch((err) => {
              if (err.name !== "NavigationDuplicated") {
                throw err;
              }
            });
        }
      }
    },
  },
  watch: {
    "$route.query.search"(newSearch) {
      this.search = newSearch;
    },
  },
};
</script>

<style lang="scss" scoped>
.search-container {
  width: 100%;
  max-width: 90vw;
}

.suggestions-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;
  background-color: white;
  position: absolute;
  top: 100%;
  width: 100%;
  z-index: 1000;
}

.suggestions-list li {
  padding: 8px;
  cursor: pointer;
}

.suggestions-list li:hover {
  background-color: #f1f1f1;
}
</style>
