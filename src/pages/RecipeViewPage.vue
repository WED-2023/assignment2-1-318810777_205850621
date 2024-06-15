<template>
  <div class="container">
    <div v-if="recipe">
      <div class="recipe-header mt-3 mb-4 text-center">
        <h1>{{ recipe.title }}</h1>
        <img :src="recipe.image" class="center img-fluid rounded" />
        <div class="recipe-details mt-3">
          <span class="detail-item">
            <i class="fas fa-clock"></i> {{ recipe.readyInMinutes }} mins
          </span>
          <span class="detail-item">
            <i class="fas fa-heart"></i> {{ recipe.aggregateLikes }} likes
          </span>
          <span class="detail-item" v-if="recipe.vegetarian">
            <i class="fas fa-seedling"></i> Vegetarian
          </span>
          <span class="detail-item" v-else>
            <i class="fas fa-drumstick-bite"></i> Non-Vegetarian
          </span>
          <span class="detail-item" v-if="recipe.glutenFree">
            <i class="fas fa-bread-slice"></i> Gluten-Free
          </span>
          <span class="detail-item" v-else>
            <i class="fas fa-bread-slice"></i> Contains Gluten
          </span>
          <span class="detail-item">
            <i class="fas fa-eye"></i> {{ recipe.isViewed ? 'Viewed' : 'Not Viewed' }}
          </span>
          <span class="detail-item">
            <i class="fas fa-star"></i> {{ recipe.isFavorited ? 'Favorited' : 'Not Favorited' }}
          </span>
        </div>
      </div>
      <div class="additional-info mt-4 text-center">
        <p><strong>Ready in:</strong> {{ recipe.readyInMinutes }} minutes</p>
        <p><strong>Likes:</strong> {{ recipe.aggregateLikes }} likes</p>
        <p><strong>Servings:</strong> {{ recipe.servings }}</p>
      </div>
      <div class="recipe-body">
        <div class="d-flex justify-content-between">
          <div class="p-2 w-50">
            <h3>Ingredients</h3>
            <ul class="list-unstyled">
              <li v-for="(ingredient, index) in recipe.extendedIngredients" :key="index + '_' + ingredient.id">
                {{ ingredient.original }}
              </li>
            </ul>
          </div>
          <div class="p-2 w-50">
            <h3>Instructions</h3>
            <ol>
              <li v-for="step in recipe._instructions" :key="step.number">
                {{ step.step }}
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mockGetRecipeFullDetails } from "../services/recipes.js";

export default {
  data() {
    return {
      recipe: null,
    };
  },
  async created() {
    try {
      const recipeId = this.$route.params.recipeId;
      const response = mockGetRecipeFullDetails(recipeId);

      if (!response.data || !response.data.recipe) {
        this.$router.replace("/notFound");
        return;
      }

      const {
        analyzedInstructions,
        instructions,
        extendedIngredients,
        aggregateLikes,
        readyInMinutes,
        image,
        title,
        servings,
        vegetarian,
        vegan,
        glutenFree,
        isViewed,
        isFavorited
      } = response.data.recipe;

      const _instructions = analyzedInstructions
        .flatMap(fstep => fstep.steps)
        .map((step, index) => ({
          ...step,
          number: index + 1
        }));

      this.recipe = {
        instructions,
        _instructions,
        analyzedInstructions,
        extendedIngredients,
        aggregateLikes,
        readyInMinutes,
        image,
        title,
        servings,
        vegetarian,
        vegan,
        glutenFree,
        isViewed,
        isFavorited
      };
    } catch (error) {
      console.log(error);
      this.$router.replace("/notFound");
    }
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

.recipe-header img {
  max-width: 100%;
  border-radius: 8px;
  margin-bottom: 20px;
}

.recipe-body {
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 8px;
}

.recipe-body h3 {
  margin-top: 0;
}

.recipe-body ul,
.recipe-body ol {
  padding-left: 20px;
}

.recipe-body li {
  margin-bottom: 10px;
}

.additional-info p {
  margin-bottom: 0.5rem;
}

.recipe-details {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 1em;
}
</style>
