<template>
  <div class="container">
    <div class="columns">
      <div class="left-column">
        <h2>Explore these recipes</h2>
        <RecipePreviewList :recipes="randomRecipes" />
        <button @click="fetchRandomRecipes">More</button>
      </div>
      <div class="right-column">
        <div v-if="!username" class="guest-message">
          <p class="welcome-text">
            Hello, Guest! Please
            <button class="link-button" @click="navigateTo('login')">Login</button>
            or
            <button class="link-button" @click="navigateTo('register')">Register</button>
            to view personalized content.
          </p>
        </div>
        <div v-else>
          <h2>Last Watched Recipes</h2>
          <RecipePreviewList :recipes="lastViewedRecipes" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RecipePreviewList from "../components/RecipePreviewList.vue";
import { mockGetRecipesPreview } from '../services/recipes.js';

export default {
  components: {
    RecipePreviewList,
  },
  data() {
    return {
      randomRecipes: [],
      username: this.$root.store.username,
      lastViewedRecipes: this.$root.store.lastViewedRecipes
    };
  },
  methods: {
    fetchRandomRecipes() {
      const response = mockGetRecipesPreview(3);
      this.randomRecipes = response.data.recipes;
    },
    navigateTo(routeName) {
      this.$router.push({ name: routeName });
    },
  },
  created() {
    this.fetchRandomRecipes();
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
}

.columns {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.left-column,
.right-column {
  width: 45%;
}

.left-column {
  text-align: center;
}

.right-column .sign-in {
  text-align: left;
}

.right-column .sign-in form {
  display: flex;
  flex-direction: column;
}

.right-column .sign-in form div {
  margin-bottom: 10px;
}

.right-column .sign-in form label {
  margin-bottom: 5px;
}

.right-column .sign-in form input[type="email"],
.right-column .sign-in form input[type="password"] {
  padding: 5px;
}

.right-column .sign-in form button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

.right-column .sign-in form button:hover {
  background-color: #0056b3;
}

.right-column .sign-in router-link {
  margin-top: 10px;
  display: block;
  color: #007bff;
  text-decoration: none;
}

.right-column .sign-in router-link:hover {
  text-decoration: underline;
}

.guest-message {
  background-image: url('@/assets/copy-space-italian-food-ingredients.jpg');
  background-size: cover;
  background-position: center;
  color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.guest-message::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(141, 137, 137, 0.5);
  border-radius: 8px;
}

.welcome-text {
  position: relative;
  font-size: 1.2em;
  color: white;
  text-shadow: 2px 2px 4px rgba(95, 91, 91, 0.7);
}

.link-button {
  padding: 0;
  font-size: 1em;
  margin: 0 5px;
  color: #007bff;
  background: none;
  border: none;
  cursor: pointer;
}

.link-button:hover {
  text-decoration: underline;
}
</style>
