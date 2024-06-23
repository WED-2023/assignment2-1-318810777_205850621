import Vue from "vue";
import App from "./App.vue";
import VueAxios from "vue-axios";
import axios from "axios";
import routes from "./routes";
import VueRouter from "vue-router";
import Vuelidate from "vuelidate";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "bootstrap";
import "jquery";
import "popper.js";

import {
  FormGroupPlugin,
  FormPlugin,
  FormInputPlugin,
  ButtonPlugin,
  CardPlugin,
  NavbarPlugin,
  FormSelectPlugin,
  AlertPlugin,
  ToastPlugin,
  LayoutPlugin,
  InputGroupPlugin,
  FormCheckboxPlugin,
  BFormTextarea,
  VBModal,
  BButtonGroup,
  BInputGroupAppend,
  BPagination,
} from "bootstrap-vue";

// Import jQuery and make it available globally
import jQuery from "jquery";
window.$ = window.jQuery = jQuery;

Vue.use(VueRouter);
const router = new VueRouter({
  routes,
});

Vue.use(Vuelidate);

[
  FormGroupPlugin,
  FormPlugin,
  FormInputPlugin,
  ButtonPlugin,
  CardPlugin,
  NavbarPlugin,
  FormSelectPlugin,
  AlertPlugin,
  ToastPlugin,
  LayoutPlugin,
  FormCheckboxPlugin,
  InputGroupPlugin,
].forEach((x) => Vue.use(x));

Vue.component("b-button-group", BButtonGroup);
Vue.component("b-input-group-append", BInputGroupAppend);
Vue.component("b-form-textarea", BFormTextarea);
Vue.component("b-pagination", BPagination);
Vue.directive("b-modal", VBModal);

axios.interceptors.request.use(
  function(config) {
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    return Promise.reject(error);
  }
);

Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

const shared_data = {
  server_domain: "http://localhost:3000",
  username: localStorage.getItem("username") || undefined,
  randomRecipes: [],
  lastViewedRecipes: [],
  favoriteRecipes: [],
  previousSearches: new Set(),
  myRecipes: [],
  lastQuery: "",
  lastSearch: JSON.parse(localStorage.getItem("lastSearch")) || null,
  login(username) {
    localStorage.setItem("username", username);
    this.username = username;
  },
  logout() {
    localStorage.removeItem("username");
    this.username = undefined;
  },
};

new Vue({
  router,
  data() {
    return {
      store: shared_data,
    };
  },
  methods: {
    toast(title, content, variant = null, append = true) {
      this.toastCount++;
      this.$bvToast.toast(content, {
        title: title,
        appendToast: append,
        variant: variant,
        solid: true,
      });
    },
  },
  watch: {
    "store.lastSearch": {
      handler(val) {
        localStorage.setItem("lastSearch", JSON.stringify(val));
      },
      deep: true,
    },
  },
  render: (h) => h(App),
}).$mount("#app");
