<template>
  <div class="search-container">
    <h1>Search Recipes</h1>
    <b-form @submit.prevent="performSearch">
      <SearchBar @mounted="focusSearchInput" />
      <div class="filter-container mt-4">
        <b-form-group label="Cuisine">
          <b-form-select
            v-model="selectedCuisine"
            :options="cuisines"
            @change="performSearch"
          ></b-form-select>
        </b-form-group>
        <b-form-group label="Diet">
          <b-form-select
            v-model="selectedDiet"
            :options="diets"
            @change="performSearch"
          ></b-form-select>
        </b-form-group>
        <b-form-group label="Intolerance">
          <b-form-select
            v-model="selectedIntolerance"
            :options="intolerances"
            @change="performSearch"
          ></b-form-select>
        </b-form-group>
        <b-form-group label="Results Per Page">
          <b-form-select
            v-model="resultsPerPage"
            :options="resultsOptions"
            @change="performSearch"
            class="w-100"
          ></b-form-select>
        </b-form-group>
        <b-button-group v-if="recipes.length > 1" class="ml-auto my-auto">
          <b-button
            class="p-2"
            :variant="lastSort === 'title' ? 'primary' : 'outline-primary'"
            @click="sortResults('title')"
            >Sort by title</b-button
          >
          <b-button
            :variant="
              lastSort === 'readyInMinutes' ? 'primary' : 'outline-primary'
            "
            @click="sortResults('readyInMinutes')"
          >
            Sort by Time
          </b-button>
          <b-button
            :variant="
              lastSort === 'aggregateLikes' ? 'primary' : 'outline-primary'
            "
            @click="sortResults('popularity')"
          >
            Sort by Popularity
          </b-button>
        </b-button-group>
      </div>
    </b-form>

    <div v-if="totalRecipes > 0">
      <b-pagination
        v-model="page"
        class="mt-3"
        :total-rows="totalRecipes"
        :per-page="resultsPerPage"
        @input="handlePageChange"
        first-number
        last-number
        align="center"
      ></b-pagination>
      <div class="recipe-list">
        <RecipePreviewList
          title="Search Results"
          :recipes="recipes"
          :perRow="3"
        />
        <b-pagination
          v-model="page"
          class="mx-auto mt-3"
          :total-rows="totalRecipes"
          :per-page="resultsPerPage"
          @input="handlePageChange"
          first-number
          last-number
          align="center"
        ></b-pagination>
      </div>
    </div>
    <div v-else-if="searchPerformed && recipes.length == 0">
      <p>No recipes found matching your criteria.</p>
    </div>
  </div>
</template>

<script>
import RecipePreviewList from "../components/RecipePreviewList.vue";
import SearchBar from "../components/SearchBar.vue";
import { searchRecipesFromServer } from "../services/recipes.js";

export default {
  name: "SearchPage",
  components: {
    RecipePreviewList,
    SearchBar,
  },
  data() {
    return {
      searchQuery: "",
      selectedCuisine: "",
      selectedDiet: "",
      selectedIntolerance: "",
      resultsPerPage: 5,
      recipes: [],
      totalRecipes: 0,
      searchPerformed: false,
      cuisines: ["No Filter", "Italian", "Mexican", "Chinese"],
      diets: ["No Filter", "Vegetarian", "Vegan", "Paleo"],
      intolerances: ["No Filter", "Dairy", "Gluten", "Peanut"],
      resultsOptions: [5, 10, 15],
      page: 1,
      sortDesc: false,
      lastSort: "",
      fetchedPages: {}, // Track fetched pages to avoid redundant API calls
    };
  },
  methods: {
    focusSearchInput(searchInput) {
      searchInput.focus();
    },
    async performSearch() {
      console.log("Performing search...");
      const query = this.searchQuery || this.$route.query.search;
      const filters = {
        diet:
          this.selectedDiet?.toLowerCase() !== "no filter" && this.selectedDiet !== ""
            ? this.selectedDiet
            : "",
        cuisines:
          this.selectedCuisine?.toLowerCase() !== "no filter" && this.selectedCuisine !== ""
            ? this.selectedCuisine
            : "",
        intolerances:
          this.selectedIntolerance?.toLowerCase() !== "no filter" &&
          this.selectedIntolerance !== ""
            ? this.selectedIntolerance
            : "",
      };

      const offset = (this.page - 1) * this.resultsPerPage;

      // Clear the fetched pages if the query has changed
      if (this.searchPerformed && (query !== this.lastSearchQuery || JSON.stringify(filters) !== JSON.stringify(this.lastSearchFilters))) {
        this.fetchedPages = {};
        this.page = 1;
      }

      // Check if the data for the current page is already fetched
      if (this.fetchedPages[this.page]) {
        this.recipes = this.fetchedPages[this.page];
        return;
      }

      const response = await searchRecipesFromServer({
        query,
        page: this.page,
        resultsPerPage: this.resultsPerPage,
        filters,
        offset,
      });

      console.log(
        "Search response for ",
        this.resultsPerPage,
        " results:",
        response
      );

      this.recipes = response.data.recipes;
      this.totalRecipes = response.data.total;
      this.searchPerformed = true;

      // Save the current query and filters for comparison in future searches
      this.lastSearchQuery = query;
      this.lastSearchFilters = filters;

      // Save fetched data for the current page
      this.fetchedPages[this.page] = this.recipes;

      this.saveLastSearch();
    },
    handlePageChange(newPage) {
      this.page = newPage;
      this.performSearch(); // Fetch data for the new page
    },
    saveLastSearch() {
      const lastSearch = {
        searchQuery: this.searchQuery,
        selectedCuisine: this.selectedCuisine || "No Filter",
        selectedDiet: this.selectedDiet || "No Filter",
        selectedIntolerance: this.selectedIntolerance || "No Filter",
        resultsPerPage: this.resultsPerPage,
        recipes: this.recipes,
        totalRecipes: this.totalRecipes,
        page: this.page,
        fetchedPages: this.fetchedPages, // Save fetched pages data
      };
      this.$root.store.lastSearch = lastSearch;
      localStorage.setItem("lastSearch", JSON.stringify(lastSearch));
    },
    sortResults(sortBy) {
      let polarity = 1;
      if (sortBy === this.lastSort) {
        this.sortDesc = !this.sortDesc;
        polarity = this.sortDesc ? -1 : 1;
      } else {
        this.sortDesc = false;
        this.lastSort = sortBy;
      }
      this.recipes.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) {
          return -1 * polarity;
        }
        if (a[sortBy] > b[sortBy]) {
          return 1 * polarity;
        }
        return 0;
      });
    },
    
  },
  created() {
    const storedLastSearch = localStorage.getItem("lastSearch");
    if (this.$root.store.lastSearch || storedLastSearch) {
      const lastSearch = this.$root.store.lastSearch || JSON.parse(storedLastSearch);
      this.searchQuery = lastSearch.searchQuery;
      this.selectedCuisine = lastSearch.selectedCuisine || "No Filter";
      this.selectedDiet = lastSearch.selectedDiet || "No Filter";
      this.selectedIntolerance = lastSearch.selectedIntolerance || "No Filter";
      this.resultsPerPage = lastSearch.resultsPerPage || 5;
      this.recipes = lastSearch.recipes || [];
      this.totalRecipes = lastSearch.totalRecipes || this.recipes.length;
      this.page = lastSearch.page || 1;
      this.fetchedPages = lastSearch.fetchedPages || {};
      this.searchPerformed = true;
    } else {
      // Set defaults if no search history is found
      this.selectedCuisine = "No Filter";
      this.selectedDiet = "No Filter";
      this.selectedIntolerance = "No Filter";
    }
  },
  mounted() {
    if (this.$route.query.search && !this.searchPerformed) {
      this.searchQuery = this.$route.query.search;
      this.performSearch();
    }
  },
  watch: {
    "$route.query.search"(newSearch) {
      this.searchQuery = newSearch;
      this.performSearch();
    },
    recipes(newValue) {
      this.saveLastSearch();
    },
  },
};
</script>

<style scoped>
.search-container {
  max-width: 80vw;
  margin: auto;
  padding: 20px;
}

.filter-container {
  display: flex;
  gap: 10px;
}

.recipe-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
