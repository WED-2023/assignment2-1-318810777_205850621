import Vue from "vue";
import App from "./App.vue";
import VueAxios from "vue-axios";
import axios from "axios";
import routes from "./routes";
import VueRouter from "vue-router";

Vue.use(VueRouter);
const router = new VueRouter({
  routes,
});

import Vuelidate from "vuelidate";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";


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
  BInputGroupAppend,
  FormCheckboxPlugin,
  BFormTextarea,
  VBModal,
} from "bootstrap-vue";

import { BButtonGroup, BButton } from "bootstrap-vue";
Vue.component("b-button-group", BButtonGroup);
Vue.component("b-input-group", InputGroupPlugin);
Vue.component("b-form-textarea", BFormTextarea);
Vue.component("b-input-group-append", BInputGroupAppend);
Vue.directive("b-modal", VBModal);

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
].forEach((x) => Vue.use(x));
Vue.use(Vuelidate);

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
