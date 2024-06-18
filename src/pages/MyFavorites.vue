<template>
  <div>
    <h1>My Favorites</h1>
    <div v-if="recipes.length > 0">
      <RecipePreviewList
        :recipes="recipes"
        :markAsViewed="markAsViewed"
        :toggleFavorite="toggleFavorite"
      />
    </div>
    <div v-else>
      <p>No favorite recipes found.</p>
    </div>
  </div>
</template>

<script>
import RecipePreviewList from "../components/RecipePreviewList.vue";

export default {
  name: "MyFavorites",
  components: {
    RecipePreviewList,
  },
  data() {
    return {
      recipes: this.$root.store.favoriteRecipes || [],
    };
  },

  methods: {
    fetchFavoriteRecipes() {
      this.recipes = this.$root.store.favoriteRecipes || [];
    },
    markAsViewed(recipe) {
      // Implement mark as viewed logic
    },
    toggleFavorite(recipeId) {
      // Implement toggle favorite logic
    },
  },
  created() {
    this.fetchFavoriteRecipes();
  },
};
</script>

<style lang="scss" scoped></style>
