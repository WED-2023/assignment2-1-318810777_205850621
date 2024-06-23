<template>
  <div>
    <h1 class="text-center mb-3">My Favorites</h1>
    <div v-if="recipes.length > 0">
      <RecipePreviewList
        :recipes="recipes"
        :markAsViewed="markAsViewed"
        :toggleFavorite="toggleFavorite"
        :perRow="3"
      />
    </div>
    <div v-else class="no-favorites">
      <img src="@/assets/fave.png" alt="No favorites" class="fave-image" />
      <p class="text-center">No favorite recipes found.</p>
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

<style lang="scss" scoped>
.no-favorites {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.fave-image {
  width: 150px; /* Adjust size as needed */
  height: auto;
  margin-bottom: 20px;
}
</style>
