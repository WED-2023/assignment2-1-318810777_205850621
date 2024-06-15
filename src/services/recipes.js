import recipe_full_view from "../assets/mocks/recipe_full_view.json";
import recipe_preview from "../assets/mocks/recipe_preview.json";

export function mockGetRecipesPreview(amount = 1, filters = {}, offset = 0) {
  let recipes = [];
  for (let i = 0; i < amount; i++) {
    let isVegetarian = Math.random() < 0.5;
    let isVegan = Math.random() < 0.5;
    let isGlutenFree = Math.random() < 0.5;

    let recipe = {
      ...recipe_preview,
      id: i + 1 + offset,
      vegan: isVegan,
      vegetarian: isVegetarian,
      glutenFree: isGlutenFree,
    }; // Ensure each recipe has a unique ID and random dietary flags

    // Apply filters

    if (filters.vegetarian && !recipe.vegetarian) continue;
    if (filters.vegan && !recipe.vegan) continue;
    if (filters.glutenFree && !recipe.glutenFree) continue;

    recipes.push(recipe);
  }

  return { data: { recipes: recipes } };
}
export function mockSearchRecipes(query, resultsPerPage, filters) {
  // Sample data for testing
  const sampleRecipes = [
    {
      id: 1,
      title: "Pasta with Garlic",
      image: "https://via.placeholder.com/150",
      readyInMinutes: 30,
      aggregateLikes: 100,
      vegetarian: true,
      glutenFree: false,
      instructions: "Boil pasta. Saute garlic. Mix together.",
    },
    {
      id: 2,
      title: "Vegan Salad",
      image: "https://via.placeholder.com/150",
      readyInMinutes: 20,
      aggregateLikes: 50,
      vegetarian: true,
      glutenFree: true,
      instructions: "Chop veggies. Mix together. Serve.",
    },
    {
      id: 3,
      title: "Gluten-Free Pancakes",
      image: "https://via.placeholder.com/150",
      readyInMinutes: 15,
      aggregateLikes: 200,
      vegetarian: true,
      glutenFree: true,
      instructions: "Mix ingredients. Cook on griddle. Serve.",
    },
  ];

  // Filter recipes based on query and filters
  const filteredRecipes = sampleRecipes.filter((recipe) => {
    const matchesQuery = recipe.title.toLowerCase().includes(query.toLowerCase());
    const matchesCuisine = !filters.cuisine || recipe.cuisine === filters.cuisine;
    const matchesDiet = !filters.diet || recipe.diet === filters.diet;
    const matchesIntolerance = !filters.intolerance || recipe.intolerance === filters.intolerance;

    return matchesQuery && matchesCuisine && matchesDiet && matchesIntolerance;
  });

  return {
    data: {
      recipes: filteredRecipes.slice(0, resultsPerPage),
    },
  };
}
export function mockGetLastViewedRecipes() {
  return { data: { recipes: [] } };
}

export function mockGetRecipeFullDetails(recipeId) {
  return {
    data: {
      recipe: {
        ...recipe_full_view,
        id: recipeId, // Ensure the recipe ID is set correctly
      },
    },
  };
}
