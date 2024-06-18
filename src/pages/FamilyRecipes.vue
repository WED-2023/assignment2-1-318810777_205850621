<template>
    <div class="family-recipes-container">
      <h1>My Family Recipes</h1>
      <div v-for="recipe in familyRecipes" :key="recipe.title" class="recipe-card">
        <h2>{{ recipe.title }}</h2>
        <img :src="recipe.image" alt="recipe image" class="recipe-image"/>
        <p><strong>Recipe by:</strong> {{ recipe.by }}</p>
        <p><strong>Occasion:</strong> {{ recipe.occasion }}</p>
        <h3>Ingredients:</h3>
        <ul>
          <li v-for="(ingredient, index) in recipe.ingredients" :key="index">{{ ingredient }}</li>
        </ul>
        <h3>Instructions:</h3>
        <ol>
          <li v-for="(instruction, index) in recipe.instructions" :key="index">{{ instruction }}</li>
        </ol>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "FamilyRecipes",
    data() {
      return {
        familyRecipes: [
          {
            title: "Baked Chicken and Potatoes",
            image: require('@/assets/chicken.jpg'),
            by: "Grandma Sarah",
            occasion: "Family Gatherings on Sundays",
            ingredients: [
              "6 chicken thighs",
              "4 potatoes, sliced",
              "1 tbsp olive oil",
              "Salt and pepper to taste",
              "1 tsp paprika",
              "1 tsp garlic powder"
            ],
            instructions: [
              "Preheat the oven to 375°F (190°C).",
              "Place the chicken thighs and sliced potatoes in a baking dish.",
              "Drizzle olive oil over the chicken and potatoes.",
              "Season with salt, pepper, paprika, and garlic powder.",
              "Bake for 45-50 minutes, or until the chicken is cooked through and the potatoes are tender."
            ]
          },
          {
            title: "Meatballs in Tomato Sauce",
            image: require('@/assets/ktzitzot.jpg'),
            by: "Uncle John",
            occasion: "Holiday Dinners",
            ingredients: [
              "1 lb ground beef",
              "1/2 cup breadcrumbs",
              "1 egg",
              "1/4 cup chopped parsley",
              "Salt and pepper to taste",
              "2 cups tomato sauce",
              "1 onion, chopped"
            ],
            instructions: [
              "In a bowl, combine the ground beef, breadcrumbs, egg, parsley, salt, and pepper.",
              "Form the mixture into meatballs.",
              "In a large pot, sauté the chopped onion until translucent.",
              "Add the tomato sauce and bring to a simmer.",
              "Add the meatballs to the sauce and cook for 30 minutes, or until the meatballs are cooked through."
            ]
          },
          {
            title: "Stuffed Peppers",
            image: require('@/assets/pilpelim.jpg'),
            by: "Aunt Maria",
            occasion: "Special Family Celebrations",
            ingredients: [
              "6 bell peppers",
              "1 cup cooked rice",
              "1/2 lb ground beef",
              "1 onion, chopped",
              "1 can diced tomatoes",
              "Salt and pepper to taste",
              "1 tsp cumin"
            ],
            instructions: [
              "Preheat the oven to 375°F (190°C).",
              "Cut the tops off the bell peppers and remove the seeds.",
              "In a bowl, mix the cooked rice, ground beef, chopped onion, diced tomatoes, salt, pepper, and cumin.",
              "Stuff the bell peppers with the mixture.",
              "Place the stuffed peppers in a baking dish and bake for 45-50 minutes, or until the peppers are tender and the filling is cooked through."
            ]
          }
        ]
      };
    }
  };
  </script>
  
  <style scoped>
  .family-recipes-container {
    max-width: 800px;
    margin: auto;
    padding: 20px;
  }
  .recipe-card {
    background-color: #f8f8f8;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .recipe-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  </style>
  