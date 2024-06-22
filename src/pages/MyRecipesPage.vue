<template>
  <div class="container">
    <h1 class="text-center mb-3">My Recipes</h1>
    <div v-if="recipes.length > 0">
      <RecipePreviewList
        :recipes="recipes"
        :markAsViewed="markAsViewed"
        :toggleFavorite="toggleFavorite"
      />
    </div>
    <div v-else class="no-recipes">
      <img src="@/assets/food.png" alt="Food" class="food-image" />
      <p class="text-center">No recipes found.</p>
    </div>
  </div>
</template>

<script>
import RecipePreviewList from "../components/RecipePreviewList.vue";

export default {
  components: {
    RecipePreviewList,
  },
  data() {
    return {
      recipes: this.$root.store.myRecipes || [],
    };
  },
  methods: {
    fetchMyRecipes() {
      this.recipes = this.$root.store.myRecipes || [];
    },
    markAsViewed(recipe) {
      // Implement mark as viewed logic
    },
    toggleFavorite(recipeId) {
      // Implement toggle favorite logic
    },
  },
  created() {
    this.fetchMyRecipes();
  },
};
</script>

<style scoped>
.no-recipes {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.food-image {
  width: 100px; /* Adjust size as needed */
  height: auto;
  margin-bottom: 20px;
}
</style>
