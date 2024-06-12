// src/store/index.js
import Vue from 'vue';
import Vuex from 'vuex';
import auth from '../services/auth';
import recipes from '../services/recipes';
import user from '../services/user';

Vue.use(Vuex);

const state = {
  server_domain: "http://localhost:3000",
  user: {
    username: null,
    lastViewedRecipes: [],
  },
  randomRecipes: [],
};

const mutations = {
  setUser(state, username) {
    state.user.username = username;
  },
  setLastViewedRecipes(state, recipes) {
    state.user.lastViewedRecipes = recipes;
  },
  setRandomRecipes(state, recipes) {
    state.randomRecipes = recipes;
  },
};

const actions = {
  async login({ commit }, credentials) {
    const response = await auth.mockLogin(credentials);
    if (response.status === 200) {
      commit('setUser', credentials.username);
    }
  },
  async register({ commit }, userDetails) {
    const response = await auth.mockRegister(userDetails);
    if (response.status === 200) {
      commit('setUser', userDetails.username);
    }
  },
  async fetchRandomRecipes({ commit }) {
    const response = recipes.mockGetRecipesPreview(3);
    commit('setRandomRecipes', response.data.recipes);
  },
  async fetchLastViewedRecipes({ commit }) {
    const response = user.mockGetLastViewedRecipes();
    commit('setLastViewedRecipes', response.data.recipes);
  },
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
});
