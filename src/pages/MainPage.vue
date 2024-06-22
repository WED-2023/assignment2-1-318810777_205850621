<template>
  <div class="container">
    <header class="hero-section">
      <h1>Welcome to Food God</h1>
      <p>Your ultimate destination for delicious recipes.</p>
    </header>
    <div class="columns">
      <div class="left-column">
        <div class="recipe-section content-background gradient-effect">
          <RecipePreviewList
            :recipes="randomRecipes"
            :lastViewedRecipes="lastViewedRecipes"
            :markAsViewed="markAsViewed"
            :toggleFavorite="toggleFavorite"
            :title="`Explore These Recipes`"
          />
          <button class="btn btn-primary mt-3" @click.stop="fetchRandomRecipes">
            More
          </button>
        </div>
      </div>
      <div class="right-column">
        <div class="recipe-section content-background gradient-effect">
          <div v-if="!username" class="guest-message">
            <p class="welcome-text">
              Hello, Guest! Please
              <a @click="navigateTo('login')">Login</a>
              or
              <a @click="navigateTo('register')">Register</a>
              to view personalized content.
            </p>
          </div>
          <div v-else>
            <div v-if="lastViewedRecipes.length > 0">
              <RecipePreviewList
                :recipes="lastViewedRecipes.slice(0, 3)"
                :markAsViewed="markAsViewed"
                :toggleFavorite="toggleFavorite"
                :title="`Last Watched Recipes`"
              />
              <button class="btn btn-primary mt-3" @click="clearHistory">
                Clear History
              </button>
            </div>
            <div v-else>
              <h3 style="color: black">Watch a recipe to see it here!</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RecipePreviewList from "../components/RecipePreviewList.vue";
import { mockGetRecipesPreview } from "../services/recipes.js";

export default {
  components: {
    RecipePreviewList,
  },
  data() {
    return {
      randomRecipes: [],
      username: this.$root.store.username,
      lastViewedRecipes: this.$root.store.lastViewedRecipes,
      favorites: this.$root.store.favoriteRecipes,
    };
  },
  methods: {
    fetchRandomRecipes() {
      const response = mockGetRecipesPreview(3, {}, this.randomRecipes.length);
      this.randomRecipes = response.data.recipes;

      this.randomRecipes.forEach((recipe) => {
        recipe.isViewed = this.lastViewedRecipes?.filter(
          (r) => r.id === recipe.id
        ).length;
        recipe.isFavorited = this.favorites?.some((r) => r.id === recipe.id);
      });
      this.lastViewedRecipes.forEach((recipe) => {
        recipe.isViewed = true;
        recipe.isFavorited = this.favorites?.some((r) => r.id === recipe.id);
      });
    },
    markAsViewed(recipe) {
      if (
        this.lastViewedRecipes.filter((r) => r.id === recipe.id).length === 0
      ) {
        this.lastViewedRecipes.push({
          ...recipe,
          addedDate: new Date(),
          lastViewedDate: new Date(),
        });
      } else {
        this.lastViewedRecipes.find(
          (r) => r.id === recipe.id
        ).lastViewedDate = new Date();
      }
      if (this.lastViewedRecipes.length > 1) {
        this.lastViewedRecipes.sort(
          (a, b) => b.lastViewedDate - a.lastViewedDate
        );
      }
      this.$root.store.lastViewedRecipes = this.lastViewedRecipes;
    },
    navigateTo(routeName) {
      this.$router.push({ name: routeName });
    },
    clearHistory() {
      this.lastViewedRecipes = [];
      localStorage.removeItem("viewedRecipes");
    },
    toggleFavorite(recipe) {
      console.log("Toggling favorite", recipe.id, this.favorites);
      if (this.favorites.filter((r) => r.id === recipe.id).length === 0) {
        this.favorites.push({
          ...recipe,
          addedDate: new Date(),
        });
      } else {
        this.favorites = this.favorites.filter((r) => r.id !== recipe.id);
      }
      if (this.favorites.length > 1) {
        this.lastViewedRecipes.sort((a, b) => b.addedDate - a.addedDate);
      }
      // Update the last viewed recipes as well

      this.$root.store.favoriteRecipes = this.favorites;
    },
  },
  created() {
    this.fetchRandomRecipes();
  },
  watch: {
    "$root.store.username"(newUsername) {
      if (!newUsername || newUsername === "") {
        this.lastViewedRecipes = [];
        this.username = "";
      }
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap");

body {
  font-family: "Open Sans", sans-serif;
  background-color: #f4f4f9;
  margin: 0;
  padding: 0;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.hero-section {
  text-align: center;
  padding: 50px 20px;
  background-image: linear-gradient(to right, #e64956, #feb47b);
  background-size: 150% 150%;
  color: white;
  border-radius: 8px;
  margin-bottom: 1rem;
  animation: gradientAnimation 6s ease infinite;
}

.hero-section h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
  font-family: "Playwrite NZ", cursive;
  font-optical-sizing: auto;
  font-weight: 900;
  font-style: normal;
}

.hero-section p {
  margin-top: 1em;
  font-size: 1.2em;
  margin-bottom: -0.8rem;
}

.columns {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.left-column,
.right-column {
  width: 45%;
  text-align: center;
}

.recipe-section.content-background {
  background-color: #fff4e6;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.guest-message {
  background-color: #ffe4e1;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.welcome-text {
  font-size: 1.2em;
  color: #333;
}

.welcome-text > a {
  padding: 0;
  font-size: 1em;
  color: #007bff !important;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
}

.welcome-text > a:after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  background: #007bff;
  transition: width 0.3s;
  bottom: -2px;
  left: 0;
}

.welcome-text > a:hover:after {
  width: 100%;
  transition: width 0.3s ease-in-out;
}

footer {
  text-align: center;
  margin-top: auto;
  padding: 20px 0;
  background-color: #333;
  color: white;
}

footer p {
  margin: 5px 0;
}

footer a {
  color: #007bff;
  text-decoration: none;
}

footer a:hover {
  text-decoration: underline;
}
</style>
