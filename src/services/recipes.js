import recipe_full_view from "../assets/mocks/recipe_full_view.json";
import recipe_preview from "../assets/mocks/recipe_preview.json";
import sampleRecipes from "../assets/mocks/sample_recipes.json";
const axios = require("axios");
const API_URL = "https://foodgod.cs.bgu.ac.il" + "/recipes";

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

export async function mockGetRecipeFullDetails(recipeId) {
  let recipePreview = await getRecipeFromServer(recipeId); //sampleRecipes.find((recipe) => recipe.id == recipeId);
  console.log(recipePreview);
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

export async function getRecipesFromServer(settings) {
  const { offset, number } = settings;
  try {
    let url = API_URL + "/search?";
    if (offset) url += `offset=${offset}`;
    if (number) {
      if (offset) url += "&"; // Add '&' if 'offset' was already appended
      url += `number=${number}`;
    }
    const response = await fetch(url);
    const data = await response.json();

    // Assuming the backend returns { recipes: [...], total: ... }
    return { data }; // Return the data directly, without additional nesting
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return { data: { recipes: [], total: 0 } }; // Return an empty array or handle the error appropriately
  }
}

export async function searchRecipesFromServer(settings) {
  const { query = "", page = 1, resultsPerPage = 5, filters = {} } = settings;

  try {
    // Set up the query parameters based on the settings object
    const params = {
      recipeName: query,
      cuisine: filters.cuisines || "",
      diet: filters.diet || "",
      intolerance: filters.intolerances || "",
      number: resultsPerPage,
      offset: (page - 1) * resultsPerPage,
    };

    // Make the GET request to the server
    const response = await axios.get(`${API_URL}/search`, { params });

    // Extract the recipes and total number of results from the server response
    const { recipes, total } = response.data;

    return {
      data: {
        recipes,
        total,
      },
    };
  } catch (error) {
    console.error("Error fetching recipes from server:", error);
    return {
      data: {
        recipes: [],
        total: 0,
      },
    };
  }
}

export async function getRecipeFromServer(recipeId) {
  try {
    const response = await axios.get(`${API_URL}/${recipeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    return { data: null }; // Handle error appropriately
  }
}
