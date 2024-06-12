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
export function mockSearchRecipes(query, amount = 5, filters = {}) {
  let recipes = [];

  for (let i = 0; i < amount; i++) {
    let recipe = { ...recipe_preview, id: i + 1 };

    if (query && !recipe.title.toLowerCase().includes(query.toLowerCase()))
      continue;
    if (filters.cuisine && recipe.cuisine !== filters.cuisine) continue;
    if (filters.diet && recipe.diet !== filters.diet) continue;
    if (filters.intolerance && recipe.intolerance !== filters.intolerance)
      continue;

    recipes.push(recipe);
  }

  return { data: { recipes: recipes } };
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
