<template>
  <div id="app">
    <div id="nav">
      <router-link :to="{ name: 'main' }">Ido and Timor's Recipes</router-link>|
      <router-link :to="{ name: 'search' }">Search</router-link>|

      <span v-if="!$root.store.username">
        <span class="mr-5">Hello Guest!</span>
        <b-button-group>
          <b-button :to="{ name: 'register' }">Register</b-button>
          <b-button :to="{ name: 'login' }">Login</b-button>
        </b-button-group>
      </span>
      <span v-else>
        {{ $root.store.username }}:
        <b-button variant="outline-danger" @click="Logout">Danger</b-button>|
      </span>
    </div>
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

<style lang="scss">
@import "@/scss/form-style.scss";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}
#nav {
  padding: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 2vw;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
