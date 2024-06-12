// src/routes.js
import MainPage from "./pages/MainPage.vue";
import NotFoundPage from "./pages/NotFoundPage.vue";
import RecipeViewPage from "./pages/RecipeViewPage.vue"; 

const routes = [
  {
    path: "/",
    name: "main",
    component: MainPage,
  },
  {
    path: "/register",
    name: "register",
    component: () => import("./pages/RegisterPage.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./pages/LoginPage.vue"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("./pages/SearchPage.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("./pages/AboutPage.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("./pages/ProfilePage.vue"),
  },
  {
    path: "/recipe/:recipeId",
    name: "recipe",
    component:RecipeViewPage,
  },
  {
    path: "*",
    name: "notFound",
    component: NotFoundPage,
  },
];

export default routes;
