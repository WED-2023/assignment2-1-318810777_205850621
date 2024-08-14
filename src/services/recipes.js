import recipe_full_view from "../assets/mocks/recipe_full_view.json";
import recipe_preview from "../assets/mocks/recipe_preview.json";
import sampleRecipes from "../assets/mocks/sample_recipes.json";
const axios = require("axios");
require("dotenv").config();
const API_URL = process.env.HOST_ADDR + "/recipes";

export function mockGetRecipesPreview(amount = 1, filters = {}, offset = 0) {
  // Select 3 random recipes from the sample recipes, up to the amount requested
  const randomRecipes = [...sampleRecipes].sort(() => 0.5 - Math.random());
  let recipes = [];
  for (let i = 0; i < amount; i++) {
    let isVegetarian = Math.random() < 0.5;
    let isVegan = Math.random() < 0.5;
    let isGlutenFree = Math.random() < 0.5;

    let recipe = {
      ...randomRecipes[i],
      // vegan: isVegan,
      // vegetarian: isVegetarian,
      // glutenFree: isGlutenFree,
    }; // Ensure each recipe has a unique ID and random dietary flags
    // Apply filters

    if (filters.vegetarian && !recipe.vegetarian) continue;
    if (filters.vegan && !recipe.vegan) continue;
    if (filters.glutenFree && !recipe.glutenFree) continue;

    recipes.push(recipe);
  }

  return { data: { recipes: recipes } };
}

export function searchRecipes(
  query = "",
  page = 1,
  resultsPerPage = 5,
  filters = {}
) {
  let filteredRecipes = sampleRecipes;

  // Filter by query
  if (query || query.length > 0) {
    filteredRecipes = filteredRecipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(query.toLowerCase()) ||
        recipe.instructions.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Filter by diet
  if (filters.diet && filters.diet !== "" && filters.diet !== "No Filter") {
    filteredRecipes = filteredRecipes.filter((recipe) =>
      recipe.diets?.some(
        (diet) => diet.toLowerCase() === filters.diet.toLowerCase()
      )
    );
  }

  // Filter by cuisines
  if (
    filters.cuisines &&
    filters.cuisines !== "" &&
    filters.cuisines !== "No Filter"
  ) {
    filteredRecipes = filteredRecipes.filter((recipe) =>
      recipe.cuisines?.some(
        (cuisine) => cuisine.toLowerCase() === filters.cuisines.toLowerCase()
      )
    );
  }

  // Filter by intolerances
  if (
    filters.intolerances &&
    filters.intolerances !== "" &&
    filters.intolerances !== "No Filter"
  ) {
    filteredRecipes = filteredRecipes.filter(
      (recipe) =>
        !recipe.intolerances?.some(
          (intolerance) =>
            intolerance.toLowerCase() === filters.intolerances.toLowerCase()
        )
    );
  }

  // Paginate results
  const startIndex = (page - 1) * resultsPerPage;
  const totalResults = filteredRecipes.length;
  const paginatedRecipes = filteredRecipes.slice(
    startIndex,
    startIndex + resultsPerPage
  );

  paginatedRecipes.forEach((recipe) => {
    recipe.vegetarian = recipe.diets?.some(
      (diet) => diet.toLowerCase() === "vegetarian"
    );
    recipe.vegan = recipe.diets?.some((diet) => diet.toLowerCase() === "vegan");
    recipe.glutenFree = !recipe.intolerances?.some(
      (intolerance) => intolerance.toLowerCase() === "gluten"
    );
    recipe.summary = recipe.instructions;
  });

  return {
    data: {
      recipes: paginatedRecipes,
      total: totalResults,
    },
  };
}

export function mockGetLastViewedRecipes() {
  return { data: { recipes: [] } };
}

export function mockGetRecipeFullDetails(recipeId) {
  let recipePreview = sampleRecipes.find((recipe) => recipe.id == recipeId);
  if (!recipePreview) {
    console.error("Recipe not found in sample recipes");
    return { data: { recipe: null } };
  }

  return {
    data: {
      recipe: {
        ...recipePreview,
        analyzedInstructions: recipe_full_view.analyzedInstructions,
        extendedIngredients: recipe_full_view.extendedIngredients,
        id: recipeId, // Ensure the recipe ID is set correctly,
        image: recipePreview.image.replace("/150", "/556/370"),
      },
    },
  };
}

export function getRecipesFromServer() {
  return { recipes: axios(API_URL) };
}

export function getRecipeFromServer(recipeId) {
  return { recipes: axios(`${API_URL}/${recipeId}`) };
}
