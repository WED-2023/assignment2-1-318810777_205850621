<template>
  <nav class="navbar navbar-expand-lg navbar-custom gradient-effect">
    <div class="container-fluid">
      <a class="navbar-brand" href="#" @click.prevent="navigateTo('main')">
        <img src="@/assets/logo.webp" alt="Logo" class="navbar-logo" />
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav mr-auto pe-2 mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link" href="#" @click.prevent="navigateTo('main')"
              >Main</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" @click.prevent="navigateTo('search')"
              >Search</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" @click.prevent="navigateTo('about')"
              >About</a
            >
          </li>
        </ul>
        <div v-if="!isSearchPage" class="d-flex searchBar ml-0">
          <SearchBar />
        </div>

        <ul class="navbar-nav ml-3 me-3">
          <li v-if="$root.store.username">
            <span class="nav-link bold-message"
              >Hello, {{ $root.store.username }}</span
            >
          </li>
          <li class="nav-item" v-if="$root.store.username">
            <a
              class="nav-link"
              href="#"
              @click.prevent="navigateTo('add-recipe')"
              >Add Recipe</a
            >
          </li>
          <li class="nav-item dropdown" v-if="$root.store.username">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdownMenuLink"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Personal Area
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
              <a
                class="dropdown-item"
                href="#"
                @click.prevent="navigateTo('favorites')"
                >My Favorite Recipes</a
              >
              <a
                class="dropdown-item"
                href="#"
                @click.prevent="navigateTo('my-recipes')"
                >My Recipes</a
              >
              <a
                class="dropdown-item"
                href="#"
                @click.prevent="navigateTo('family-recipes')"
                >Family Recipes</a
              >
            </div>
          </li>
          <li class="nav-item" v-if="$root.store.username">
            <a class="nav-link" href="#" @click.prevent="logout">Sign Out</a>
          </li>
          <li v-else>
            <span class="nav-link bold-message">Hello, Guest</span>
          </li>
          <li v-if="!$root.store.username">
            <a class="nav-link" href="#" @click.prevent="navigateTo('login')"
              >Login</a
            >
          </li>
          <li v-if="!$root.store.username">
            <a class="nav-link" href="#" @click.prevent="navigateTo('register')"
              >Register</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import SearchBar from "./SearchBar.vue";

export default {
  name: "MainMenu",
  components: {
    SearchBar,
  },
  data() {
    return {
      search: this.$root.store.lastSearch?.searchQuery || "",
      isSearchPage: this.$route.name === "search",
    };
  },
  mounted() {
    this.initializeDropdown();
    this.isSearchPage = this.$route.name === "search";
  },
  methods: {
    initializeDropdown() {
      $(document).ready(function() {
        $(".dropdown-toggle").dropdown();
      });
    },
    navigateTo(routeName) {
      if (this.$route.name !== routeName) {
        this.$router.push({ name: routeName });
      }
    },
    onSearch() {
      const newQuery = { search: this.search };
      const currentQuery = this.$route.query;
      const isQueryDifferent = Object.keys(newQuery).some(
        (key) => newQuery[key] !== currentQuery[key]
      );

      if (isQueryDifferent) {
        this.$router.push({ name: "search", query: newQuery }).catch((err) => {
          if (err.name !== "NavigationDuplicated") {
            throw err;
          }
        });
      }
    },
    logout() {
      this.$root.store.logout();
      this.$root.toast("Logout", "User logged out successfully", "success");
      this.$root.store.watchedRecipes = [];
      this.$root.store.favoriteRecipes = [];
      this.$root.store.lastViewedRecipes = [];
      localStorage.removeItem("lastSearch");
      this.$root.store.lastQuery = null;
      this.$root.store.myRecipes = [];

      this.$router.push("/").catch(() => {
        this.$forceUpdate();
      });
    },
  },
  watch: {
    "$route.name"(newRoute) {
      this.isSearchPage = newRoute === "search";
    },
  },
};
</script>

<style scoped>
.navbar-custom {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  opacity: 0.96;
}
.navbar-custom .navbar-brand {
  font-size: 1.25rem;
  font-weight: bold;
}
.navbar-custom .form-control {
  width: 20rem;
}
.navbar-logo {
  height: 60px;
}
a {
  text-decoration: none;
  color: #2c3e50;
}
.bold-message {
  font-weight: bold;
  color: #000;
}
.searchBar {
  width: 30%;
  right: 0;
  transition: width 0.3s ease-in;
}
.searchBar:hover {
  width: 40%;
  transition: width 1s ease-in-out;
}
</style>
