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
            @click="sortResults('aggregateLikes')"
          >
            Sort by Popularity
          </b-button>
        </b-button-group>
      </div>
    </b-form>

    <div v-if="recipes.length > 1">
      <b-pagination
        v-model="page"
        class="mt-3"
        :total-rows="totalRecipes"
        :per-page="resultsPerPage"
        @input="performSearch"
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
          @input="performSearch"
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
import { searchRecipes } from "../services/recipes.js";

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
      lastSearch: this.$root.store.lastSearch,
      page: 1,
      sortDesc: false,
      lastSort: "",
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
          this.selectedDiet !== "No Filter" && this.selectedDiet !== ""
            ? this.selectedDiet
            : "",
        cuisines:
          this.selectedCuisine !== "No Filter" && this.selectedCuisine !== ""
            ? this.selectedCuisine
            : "",
        intolerances:
          this.selectedIntolerance !== "No Filter" &&
          this.selectedIntolerance !== ""
            ? this.selectedIntolerance
            : "",
      };

      const response = await searchRecipes(
        query,
        this.page,
        this.resultsPerPage,
        filters
      );

      console.log("Search response:", response);

      this.recipes = response.data.recipes;
      this.totalRecipes = response.data.total;
      this.searchPerformed = true;

      this.$root.store.lastSearch = {
        searchQuery: this.searchQuery,
        selectedCuisine: this.selectedCuisine,
        selectedDiet: this.selectedDiet,
        selectedIntolerance: this.selectedIntolerance,
        resultsPerPage: this.resultsPerPage,
        recipes: this.recipes,
      };
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
    if (this.$root.store.lastSearch) {
      const lastSearch = this.$root.store.lastSearch;
      this.searchQuery = lastSearch.searchQuery;
      this.selectedCuisine = lastSearch.selectedCuisine;
      this.selectedDiet = lastSearch.selectedDiet;
      this.selectedIntolerance = lastSearch.selectedIntolerance;
      this.resultsPerPage = lastSearch.resultsPerPage;
      this.recipes = lastSearch.recipes;
      this.totalRecipes = lastSearch.totalRecipes || this.recipes.length;
    } else {
      if (this.searchQuery) {
        this.performSearch();
      }
    }
  },
  mounted() {
    if (this.$route.query.search) {
      this.searchQuery = this.$route.query.search;
      this.selectedCuisine = "";
      this.selectedDiet = "";
      this.selectedIntolerance = "";
      this.resultsPerPage = 5;
      this.performSearch();
    }
  },
  watch: {
    "$route.query.search"(newSearch) {
      this.searchQuery = newSearch;
      this.performSearch();
    },
    recipes(newValue) {
      this.$root.store.lastSearch = {
        searchQuery: this.searchQuery,
        selectedCuisine: this.selectedCuisine,
        selectedDiet: this.selectedDiet,
        selectedIntolerance: this.selectedIntolerance,
        resultsPerPage: this.resultsPerPage,
        recipes: newValue,
        totalRecipes: this.totalRecipes,
      };
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
