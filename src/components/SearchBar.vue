<template>
  <div class="search-container">
    <div class="input-group position-relative">
      <input
        ref="searchInput"
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
          v-for="suggestion in filteredSuggestions.slice(0, 7)"
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
      if (this.$root.store.lastSearch?.query?.length > 3) {
        this.$root.store.previousSearches.add(
          this.$root.store.lastSearch.query
        );
      }
      return Array.from(this.$root.store.previousSearches);
    },
    filteredSuggestions() {
      const lowerCaseSearch = this.search.toLowerCase();
      return this.suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(lowerCaseSearch)
      );
    },
  },
  methods: {
    debounceSearch: debounce(function() {
      this.onSearch();
    }, 1000), // Debounce for 300ms

    longerDebounceSearch: debounce(function() {
      if (this.search.length > 3) {
        this.$root.store.previousSearches.add(this.search); // Add search term to previous searches
      }
    }, 3000), // Debounce for 3 seconds

    handleSearchKeyup(event) {
      this.longerDebounceSearch(); // Call longer debounce function
      this.debounceSearch(); // Call debounce function
      if (event.key === "Enter") {
        this.onSearch();
        this.$root.store.previousSearches.add(this.search);
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
  mounted() {
    this.$emit("mounted", this.$refs.searchInput);
  },
};
</script>

<style scoped>
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
