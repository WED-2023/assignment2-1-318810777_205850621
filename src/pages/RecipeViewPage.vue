<template>
  <div class="container">
    <div v-if="recipe">
      <div class="recipe-card gradient-effect">
        <div class="recipe-header mt-3 mb-4 text-center">
          <h1>{{ recipe.title }}</h1>
          <img :src="recipe.image" alt="recipe image" class="recipe-image" />
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
              <i class="fas fa-eye"></i>
              {{ recipe.isViewed ? "Viewed" : "Not Viewed" }}
            </span>
            <span class="detail-item">
              <i class="fas fa-star"></i>
              {{ recipe.isFavorited ? "Favorited" : "Not Favorited" }}
            </span>
          </div>
        </div>
        <div class="additional-info mt-4 text-center">
          <p><strong>Ready in:</strong> {{ recipe.readyInMinutes }} minutes</p>
          <p><strong>Likes:</strong> {{ recipe.aggregateLikes }} likes</p>
          <p><strong>Servings:</strong> {{ recipe.servings }}</p>
        </div>
        <div class="family-recipes-container">
          <div class="recipe-body">
            <h3>Ingredients:</h3>
            <ul>
              <li
                v-for="(ingredient, index) in recipe.extendedIngredients"
                :key="index + '_' + ingredient.id"
              >
                {{ ingredient.original }}
              </li>
            </ul>
            <h3>Instructions:</h3>
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
import {
  getRecipeFromServer,
  mockGetRecipeFullDetails,
} from "../services/recipes.js";

export default {
  // props: {
  //   recipe: {
  //     type: Object,
  //     required: true,
  //   },
  // },
  data() {
    return { recipe: {} };
  },
  async created() {
    // try {
    const recipeId = this.$route.params.recipeId;
    const response = await getRecipeFromServer(recipeId);
    console.log(response);

    // if (!response.data || !response.data.recipe) {
    //   this.$router.replace("/notFound");
    //   return;
    // }

    const {
      id,
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
    } = response;
    console.log(response);
    let isFavorited = this.$root.store.favoriteRecipes.some(
      (fav) => fav.id === id
    );
    let isViewed = this.$root.store.lastViewedRecipes.some(
      (viewed) => viewed.id === id
    );

    const _instructions = (analyzedInstructions || [])
      .flatMap((fstep) => fstep.steps)
      .map((step, index) => ({
        ...step,
        number: index + 1,
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
      isFavorited,
    };
    // } catch (error) {
    //   console.log(error);
    //   this.$router.replace("/notFound");
    // }
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

.recipe-card {
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.recipe-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px;
}

.family-recipes-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
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

.additional-info p {
  margin-bottom: 0.5rem;
}
</style>
