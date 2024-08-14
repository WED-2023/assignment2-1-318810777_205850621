<template>
  <b-container class="recipe-container">
    <h3>
      {{ title ? title + ":" : "" }}
      <slot></slot>
    </h3>
    <b-row class="text-center" align-v="center">
      <b-col
        cols="12"
        :md="itemsPerRow"
        v-for="recipe in recipes"
        :key="recipe.id"
      >
        <RecipePreview
          class="recipePreview"
          :recipe="recipe"
          :markAsViewed="markAsViewed"
          :toggleFavorite="toggleFavorite"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";
import { mockGetRecipesPreview } from "../services/recipes.js";

export default {
  name: "RecipePreviewList",
  components: {
    RecipePreview,
  },
  props: {
    title: {
      type: String,
      required: false,
    },
    recipes: {
      type: Array,
      required: true,
    },
    perRow: {
      type: Number,
      required: false,
    },
    // lastViewedRecipes: {
    //   type: Array,
    //   required: false,
    // },
    // markAsViewed: {
    //   type: Function,
    //   required: false,
    // },
    // toggleFavorite: {
    //   type: Function,
    //   required: false,
    // },
  },
  data() {
    return {
      localRecipes: [],
      itemsPerRow: this.perRow ? 12 / this.perRow : 12 / 2,
    };
  },
  mounted() {
    // Load favorites from localStorage
    // const storedFavorites = localStorage.getItem("favoriteRecipes");
    // this.favorites = storedFavorites ? JSON.parse(storedFavorites) : this.$root.store.favoriteRecipes;

    // // Set the favorites in the store
    // this.$root.store.favoriteRecipes = this.favorites;

    this.itemsPerRow = this.perRow ? 12 / this.perRow : 12 / 2;
    this.updateRecipeIndicators();
  },
  methods: {
    updateRecipeIndicators() {
      this.recipes.forEach((recipe) => {
        recipe.isFavorited = this.$root.store.favoriteRecipes.some(
          (fav) => fav.id === recipe.id
        );
        recipe.isViewed = this.$root.store.lastViewedRecipes.some(
          (viewed) => viewed.id === recipe.id
        );
      });
    },
    toggleFavorite(recipe) {
      const recipeIndex = this.$root.store.favoriteRecipes.findIndex(
        (r) => r.id === recipe.id
      );
      if (recipeIndex !== -1) {
        // Remove from favorites
        this.$root.store.favoriteRecipes.splice(recipeIndex, 1);
        recipe.isFavorited = false;
      } else {
        // Add to favorites
        this.$root.store.favoriteRecipes.push(recipe);
        recipe.isFavorited = true;
      }

      // Persist favorites to localStorage
      localStorage.setItem(
        "favoriteRecipes",
        JSON.stringify(this.$root.store.favoriteRecipes)
      );
      this.$forceUpdate(); // Force component re-render
    },
    markAsViewed(recipe) {
      if (!this.$root.store.lastViewedRecipes.some((r) => r.id === recipe.id)) {
        this.$root.store.lastViewedRecipes.push(recipe);
      }
      recipe.isViewed = true;

      // Persist viewed recipes to localStorage
      localStorage.setItem(
        "viewedRecipes",
        JSON.stringify(this.$root.store.lastViewedRecipes)
      );
    },
    async updateRecipes() {
      try {
        const amountToFetch = 10; // Set this to how many recipes you want to fetch
        const response = mockGetRecipesPreview(amountToFetch);
        const recipes = response.data.recipes;
        const viewedRecipes =
          JSON.parse(localStorage.getItem("viewedRecipes")) || []; // Get viewed recipes from local storage
        this.recipes = [];
        this.recipes.push(...recipes);
        this.recipes.forEach((recipe) => {
          if (viewedRecipes.includes(recipe.id)) {
            recipe.isViewed = true;
          }
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
.recipe-container {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.recipe-preview-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.recipe-preview {
  margin: 10px 0;
  text-align: center;
}

.recipe-preview img {
  max-width: 100%;
  border-radius: 8px;
}
</style>
