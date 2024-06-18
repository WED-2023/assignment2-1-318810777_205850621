<template>
  <nav class="navbar navbar-expand-lg navbar-custom">
    <div class="container-fluid">
      <a class="navbar-brand" href="#" @click.prevent="navigateTo('main')">
        <img src="@/assets/logo.webp" alt="Logo" class="navbar-logo" />
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav ms-auto pe-2 mb-2 mb-lg-0">
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
        <form class="d-flex searchBar">
          <SearchBar />
        </form>
        <ul class="navbar-nav ml-auto me-3">
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
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Personal Area
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
              <li>
                <a
                  class="dropdown-item"
                  href="#"
                  @click.prevent="navigateTo('favorites')"
                  >My Favorite Recipes</a
                >
              </li>
              <li>
                <a
                  class="dropdown-item"
                  href="#"
                  @click.prevent="navigateTo('my-recipes')"
                  >My Recipes</a
                >
              </li>
              <li>
                <a
                  class="dropdown-item"
                  href="#"
                  @click.prevent="navigateTo('family')"
                  >Family Recipes</a
                >
              </li>
            </ul>
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
    };
  },
  methods: {
    navigateTo(routeName) {
      if (this.$route.name !== routeName) {
        this.$router.push({ name: routeName });
      }
    },
    onSearch() {
      const newQuery = { search: this.search };
      const currentQuery = this.$route.query;
      // Check if the new query is different from the current query
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
    // handleSearchKeyup(event) {
    //   if (event.key === "Enter") {
    //     this.onSearch();
    //   } else if (event.key === "Backspace" || event.key === "Delete") {
    //     this.updateQueryString();
    //   } else {
    //     if (this.search.length > 3 || this.search.length === 0) {
    //       this.onSearch();
    //     }
    //   }
    // },
    // updateQueryString() {
    //   const newQuery = { ...this.$route.query, search: this.search };
    //   this.$router.push({ query: newQuery }).catch(() => {});
    // },
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
  height: 60px; /* Increased height */
  /* Optional: Adjust width if needed */
  /* width: auto; */
}
a {
  text-decoration: none;
  color: #2c3e50;
}
.bold-message {
  font-weight: bold;
  color: #000;
}
.dropdown-menu[data-bs-popper] {
  left: -5rem;
}

.searchBar {
  width: 30%;
  transition: width 0.3s ease-in;
}
.searchBar:hover {
  width: 40%;
  transition: width 1s ease-in-out;
}
</style>
