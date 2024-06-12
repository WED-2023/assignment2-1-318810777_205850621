<template>
  <b-container>
    <h3>
      {{ title }}:
      <slot></slot>
    </h3>
    <b-row class="text-center" align-v="center">
      <b-col cols="12" md="4" v-for="recipe in recipes" :key="recipe.id">
        <RecipePreview class="recipePreview" :recipe="recipe" />
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
      required: true,
    },
    recipes: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      localRecipes: [],
    };
  },
  mounted() {
    this.updateRecipes();
  },
  methods: {
    async updateRecipes() {
      try {
        const amountToFetch = 10; // Set this to how many recipes you want to fetch
        const response = mockGetRecipesPreview(amountToFetch);
        const recipes = response.data.recipes;
        this.localRecipes = [];
        this.localRecipes.push(...recipes);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
.container {
  min-height: 400px;
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
