<template>
  <div class="search-container">
    <h1>Search Recipes</h1>
    <b-form @submit.prevent="performSearch">
      <b-input-group class="mb-3">
        <b-form-input
          v-model="searchQuery"
          placeholder="Search for recipes..."
        ></b-form-input>
        <b-input-group-append>
          <b-button type="submit" variant="primary">Search</b-button>
        </b-input-group-append>
      </b-input-group>

      <div class="filter-container">
        <b-form-group label="Cuisine">
          <b-form-select v-model="selectedCuisine" :options="cuisines"></b-form-select>
        </b-form-group>
        <b-form-group label="Diet">
          <b-form-select v-model="selectedDiet" :options="diets"></b-form-select>
        </b-form-group>
        <b-form-group label="Intolerance">
          <b-form-select v-model="selectedIntolerance" :options="intolerances"></b-form-select>
        </b-form-group>
        <b-form-group label="Results Per Page">
          <b-form-select v-model="resultsPerPage" :options="resultsOptions"></b-form-select>
        </b-form-group>
      </div>
    </b-form>

    <div v-if="recipes.length > 0">
      <b-button-group class="mb-3">
        <b-button @click="sortResults('readyInMinutes')">Sort by Time</b-button>
        <b-button @click="sortResults('aggregateLikes')">Sort by Popularity</b-button>
      </b-button-group>

      <div class="recipe-list">
        <RecipePreview
          v-for="recipe in recipes"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>
    </div>
    <div v-else-if="searchPerformed">
      <p>No recipes found matching your criteria.</p>
    </div>
  </div>
</template>

<script>
import RecipePreview from "../components/RecipePreview.vue";
import { mockSearchRecipes } from "../services/recipes.js";

export default {
  data() {
    return {
      searchQuery: "",
      selectedCuisine: "",
      selectedDiet: "",
      selectedIntolerance: "",
      resultsPerPage: 5,
      recipes: [],
      searchPerformed: false,
      cuisines: ["No Filter", "Italian", "Mexican", "Chinese"],
      diets: ["No Filter", "Vegetarian", "Vegan", "Paleo"],
      intolerances: ["No Filter", "Dairy", "Gluten", "Peanut"],
      resultsOptions: [5, 10, 15],
    };
  },
  methods: {
    performSearch() {
      const filters = {
        cuisine: this.selectedCuisine !== "No Filter" ? this.selectedCuisine : "",
        diet: this.selectedDiet !== "No Filter" ? this.selectedDiet : "",
        intolerance: this.selectedIntolerance !== "No Filter" ? this.selectedIntolerance : "",
      };
      const response = mockSearchRecipes(this.searchQuery, this.resultsPerPage, filters);
      this.recipes = response.data.recipes;
      this.searchPerformed = true;
    },
    sortResults(sortBy) {
      this.recipes.sort((a, b) => a[sortBy] - b[sortBy]);
    },
  },
  created() {
    // Load last search if available
    if (this.$root.store.lastSearch) {
      const lastSearch = this.$root.store.lastSearch;
      this.searchQuery = lastSearch.searchQuery;
      this.selectedCuisine = lastSearch.selectedCuisine;
      this.selectedDiet = lastSearch.selectedDiet;
      this.selectedIntolerance = lastSearch.selectedIntolerance;
      this.resultsPerPage = lastSearch.resultsPerPage;
      this.recipes = lastSearch.recipes;
    }
  },
  watch: {
    recipes(newValue) {
      this.$root.store.lastSearch = {
        searchQuery: this.searchQuery,
        selectedCuisine: this.selectedCuisine,
        selectedDiet: this.selectedDiet,
        selectedIntolerance: this.selectedIntolerance,
        resultsPerPage: this.resultsPerPage,
        recipes: newValue,
      };
    },
  },
  components: {
    RecipePreview,
  },
};
</script>

<style scoped>
.search-container {
  max-width: 800px;
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
