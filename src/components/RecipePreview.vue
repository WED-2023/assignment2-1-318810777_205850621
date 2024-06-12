<template>
  <div class="recipe-wrapper">
    <router-link
      :to="{ name: 'recipe', params: { recipeId: recipe.id } }"
      class="recipe-preview"
    >
      <div class="recipe-body">
        <img v-if="imageLoaded" :src="recipe.image" class="recipe-image" />
      </div>
      <div class="recipe-footer">
        <div class="recipe-title" :title="recipe.title">
          {{ recipe.title }}
        </div>
        <div class="recipe-details">
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
        </div>
        <div class="recipe-indicators">
          <span v-if="recipe.isViewed" class="indicator viewed">Viewed</span>
          <span v-if="recipe.isFavorited" class="indicator favorited">Favorited</span>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageLoaded: false,
    };
  },
  props: {
    recipe: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    const img = new Image();
    img.src = this.recipe.image;
    img.onload = () => {
      this.imageLoaded = true;
    };
  },
};
</script>

<style scoped>
.recipe-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  justify-content: center;
}

.recipe-preview {
  display: block;
  width: 100%;
  max-width: 25vw;
  margin: 1rem auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
  text-decoration: none;
  color: inherit;
}

.recipe-preview:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.recipe-body {
  width: 100%;
  height: auto;
  max-height: 30vh;
  overflow: hidden;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.recipe-preview:hover .recipe-image {
  transform: scale(1.05);
}

.recipe-footer {
  padding: 15px;
  background-color: #fff;
}

.recipe-title {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.recipe-details {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9em;
}

.recipe-indicators {
  display: flex;
  justify-content: space-between;
}

.indicator {
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.8em;
  font-weight: bold;
}

.viewed {
  background-color: #e0e0e0;
}

.favorited {
  background-color: #ffe0e0;
  color: #ff0000;
}
</style>
