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
    <div v-else>
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
/* Add styles if needed */
</style>
