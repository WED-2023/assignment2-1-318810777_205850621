import recipe_full_view from "../assets/mocks/recipe_full_view.json";
import recipe_preview from "../assets/mocks/recipe_preview.json";
import sampleRecipes from "../assets/mocks/sample_recipes.json";

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

export function mockSearchRecipes(
  query = "",
  page = 1,
  resultsPerPage = 5,
  filters = {}
) {
  let filteredRecipes = sampleRecipes;
  console.log("Filters: ", filters);
  console.log("Recipes input: ", sampleRecipes.length);

  // Filter by query
  if (query || query.length > 0) {
    console.log("Query: ", query);
    filteredRecipes = filteredRecipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(query.toLowerCase()) ||
        recipe.instructions.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Filter by diet
  if (filters.diet && filters.diet !== "" && filters.diet !== "No Filter") {
    console.log("Diet: ", filters.diet);
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
    console.log("Cuisines: ", filters.cuisines);
    filteredRecipes = filteredRecipes.filter((recipe) =>
      recipe.cuisines?.some((cuisine) => {
        return cuisine.toLowerCase() === filters.cuisines.toLowerCase();
      })
    );
  }

  // Filter by intolerances
  if (
    filters.intolerances &&
    filters.intolerances !== "" &&
    filters.intolerances !== "No Filter"
  ) {
    console.log("Intolerances: ", filters.intolerances);
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
  console.log("Filtered recipes: ", filteredRecipes.length);
  const paginatedRecipes = filteredRecipes.slice(
    startIndex,
    startIndex + resultsPerPage
  );

  paginatedRecipes.forEach((recipe) => {
    recipe.vegetarian = recipe.diets?.some(
      (diet) => diet.toLowerCase() === "vegetarian"
    );
    recipe.vegan =
      recipe.diets?.some((diet) => diet.toLowerCase() === "vegan") &&
      !recipe.intolerances?.some(
        (intolerance) => intolerance.toLowerCase() === "dairy"
      );
    recipe.glutenFree = !recipe.intolerances?.some(
      (intolerance) => intolerance.toLowerCase() === "gluten"
    );
    recipe.summary = recipe.instructions;
  });

  return {
    data: {
      recipes: paginatedRecipes,
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
