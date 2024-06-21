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
    lastViewedRecipes: {
      type: Array,
      required: false,
    },
    markAsViewed: {
      type: Function,
      required: false,
    },
    toggleFavorite: {
      type: Function,
      required: false,
    },
    favorites: {
      type: Array,
      required: false,
    },
    perRow: {
      type: Number,
      required: false,
    },
  },
  data() {
    return {
      localRecipes: [],
      itemsPerRow: this.perRow ? 12 / this.perRow : 12 / 2,
    };
  },
  mounted() {
    this.itemsPerRow = this.perRow ? 12 / this.perRow : 12 / 2;
    if (this.recipes.length !== 0) {
      this.recipes.forEach((recipe) => {
        // Check if the recipe is in the viewedRecipes array
        if (this.lastViewedRecipes?.includes(recipe)) {
          recipe.isViewed = true;
        }
        if (this.favorites?.includes(recipe)) {
          recipe.isFavorited = true;
        }
      });
    }
  },
  methods: {
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
