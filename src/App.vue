<template>
  <div id="app">
    <b-navbar
      pills
      toggleable="lg"
      type="dark"
      variant="dark"
      size="lg"
      sticky
      id="nav"
    >
      <b-navbar-brand :to="{ name: 'main' }"
        >Ido and Timor's Recipes</b-navbar-brand
      >

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item :to="{ name: 'main' }">Home</b-nav-item>
          <b-nav-item :to="{ name: 'search' }">Search</b-nav-item>

          <b-nav-item-dropdown v-if="!$root.store.username" text="Guest" right>
            <b-dropdown-item :to="{ name: 'register' }"
              >Register</b-dropdown-item
            >
            <b-dropdown-item :to="{ name: 'login' }">Login</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown v-else right>
            <template #button-content>
              {{ $root.store.username }}
            </template>
            <b-dropdown-item @click="Logout">Logout</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    Logout() {
      this.$root.store.logout();
      this.$root.toast("Logout", "User logged out successfully", "success");
      this.$router.push("/").catch(() => {
        this.$forceUpdate();
      });
    },
  },
};
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@100..900&display=swap" rel="stylesheet"></link>
<style lang="scss">

@import "@/scss/form-style.scss";
#app {
  font-family: Heebo, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin-bottom: 2em;
}
#nav a {
  font-weight: 800;
}
#nav a.router-link-exact-active {
}
</style>
