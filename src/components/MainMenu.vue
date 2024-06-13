<template>
  <nav class="navbar navbar-expand-lg navbar-custom">
    <div class="container-fluid">
      <a class="navbar-brand" href="#" @click.prevent="navigateTo('main')"
        >Logo</a
      >
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
        <form class="d-flex" @submit.prevent="onSearch">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            v-model="search"
          />
        </form>
        <ul class="navbar-nav ml-auto me-3">
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdownMenuLink"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ $root.store.username ? $root.store.username : "Account" }}
            </a>
            <ul
              class="dropdown-menu me-3"
              aria-labelledby="navbarDropdownMenuLink"
            >
              <li>
                <a
                  class="dropdown-item"
                  href="#"
                  @click.prevent="navigateTo('login')"
                  v-if="!$root.store.username"
                  >Login</a
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
              <li>
                <a
                  class="dropdown-item"
                  href="#"
                  @click.prevent="navigateTo('add-recipe')"
                  >Add Recipe</a
                >
              </li>
              <li>
                <a
                  class="dropdown-item"
                  href="#"
                  @click.prevent="logout"
                  v-if="$root.store.username"
                  >Sign Out</a
                >
              </li>
            </ul>
          </li>
          <!-- <li v-if="!$root.store.username">
            <a class="nav-link" href="#" @click.prevent="navigateTo('register')"
              >Register</a
            >
          </li>
          <li v-else>
            <a class="nav-link" href="#" @click.prevent="navigateTo('login')"
              >Login</a
            >
          </li> -->
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "MainMenu",
  data() {
    return {
      search: "",
    };
  },
  methods: {
    navigateTo(routeName) {
      if (this.$route.name !== routeName) {
        this.$router.push({ name: routeName });
      }
    },
    onSearch() {
      this.$router.push({ name: "search", query: { search: this.search } });
    },
    logout() {
      this.$root.store.username = null;
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
}
.navbar-custom .navbar-brand {
  font-size: 1.25rem;
  font-weight: bold;
}
.navbar-custom .form-control {
  width: 20rem;
}

.dropdown-menu[data-bs-popper] {
  left: -90%;
}
</style>
