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
            :title="`Explore These Recipes`"
          />
          <button class="btn btn-primary mt-3" @click.stop="handleMoreClick">
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
                :recipes="lastViewedRecipes"
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
import { getRecipesFromServer } from "../services/recipes.js";

export default {
  components: {
    RecipePreviewList,
  },
  data() {
    return {
      randomRecipes: this.$root.store.randomRecipes || [],
      username: this.$root.store.username,
      lastViewedRecipes: this.$root.store.lastViewedRecipes || [],
      favorites: this.$root.store.favoriteRecipes || [],
    };
  },
  methods: {
    async fetchRandomRecipes(offset = 0, number = 3) {
      const response = await getRecipesFromServer({ offset, number });
      console.log(response);
      const newRecipes = response.data.recipes;

      // Update local data and global store
      this.randomRecipes = [...this.randomRecipes, ...newRecipes];
      this.$root.store.randomRecipes = this.randomRecipes;

      // Update each recipe's view and favorite status
      this.updateRecipeStatus(newRecipes);
      
      // Save the updated recipes to localStorage
      localStorage.setItem("randomRecipes", JSON.stringify(this.randomRecipes));
    },
    navigateTo(routeName) {
      this.$router.push({ name: routeName });
    },
    clearHistory() {
      this.lastViewedRecipes = [];
      this.$root.store.lastViewedRecipes = [];
      localStorage.removeItem("viewedRecipes");
    },
    handleMoreClick() {
      this.fetchRandomRecipes(this.randomRecipes.length, 3);
    },
  },
  created() {
    const storedRecipes = localStorage.getItem("randomRecipes");
    const storedViewedRecipes = localStorage.getItem("viewedRecipes");
    const storedFavorites = localStorage.getItem("favoriteRecipes");

    if (storedRecipes) {
      this.randomRecipes = JSON.parse(storedRecipes);
      this.$root.store.randomRecipes = this.randomRecipes;
    } else {
      this.fetchRandomRecipes(0, 3);
    }

    if (storedViewedRecipes) {
      this.lastViewedRecipes = JSON.parse(storedViewedRecipes);
      this.$root.store.lastViewedRecipes = this.lastViewedRecipes;
    }

    if (storedFavorites) {
      this.favorites = JSON.parse(storedFavorites);
      this.$root.store.favoriteRecipes = this.favorites;
    }
  },
  watch: {
    "$root.store.username"(newUsername) {
      if (!newUsername || newUsername === "") {
        this.lastViewedRecipes = [];
        this.username = "";
        localStorage.removeItem("viewedRecipes");
        localStorage.removeItem("favoriteRecipes");
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
  background-image: linear-gradient(
    to right,
    var(--tertiary-color),
    var(--primary-color)
  );
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
