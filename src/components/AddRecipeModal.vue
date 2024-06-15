<template>
    <b-modal id="add-recipe-modal" title="Create New Recipe" @ok="onSubmit">
      <b-form @submit.stop.prevent="onSubmit">
        <b-form-group label="Title" label-for="title">
          <b-form-input
            id="title"
            v-model="form.title"
            required
          ></b-form-input>
        </b-form-group>
  
        <b-form-group label="Image URL" label-for="image">
          <b-form-input
            id="image"
            v-model="form.image"
            required
          ></b-form-input>
        </b-form-group>
  
        <b-form-group label="Ready In Minutes" label-for="readyInMinutes">
          <b-form-input
            id="readyInMinutes"
            v-model="form.readyInMinutes"
            type="number"
            required
          ></b-form-input>
        </b-form-group>
  
        <b-form-group label="Servings" label-for="servings">
          <b-form-input
            id="servings"
            v-model="form.servings"
            type="number"
            required
          ></b-form-input>
        </b-form-group>
  
        <b-form-group label="Ingredients" label-for="ingredients">
          <b-form-textarea
            id="ingredients"
            v-model="form.ingredients"
            placeholder="List each ingredient on a new line"
            rows="5"
            required
          ></b-form-textarea>
        </b-form-group>
  
        <b-form-group label="Instructions" label-for="instructions">
          <b-form-textarea
            id="instructions"
            v-model="form.instructions"
            placeholder="List each step on a new line"
            rows="5"
            required
          ></b-form-textarea>
        </b-form-group>
  
        <b-form-group label="Vegetarian" label-for="vegetarian">
          <b-form-checkbox
            id="vegetarian"
            v-model="form.vegetarian"
          >Vegetarian</b-form-checkbox>
        </b-form-group>
  
        <b-form-group label="Gluten-Free" label-for="glutenFree">
          <b-form-checkbox
            id="glutenFree"
            v-model="form.glutenFree"
          >Gluten-Free</b-form-checkbox>
        </b-form-group>
      </b-form>
    </b-modal>
  </template>
  
  <script>
  export default {
    data() {
      return {
        form: {
          title: '',
          image: '',
          readyInMinutes: '',
          servings: '',
          ingredients: '',
          instructions: '',
          vegetarian: false,
          glutenFree: false,
        },
      };
    },
    methods: {
      onSubmit() {
        // Convert ingredients and instructions to arrays
        const ingredientsArray = this.form.ingredients.split('\n').map(ingredient => ({ original: ingredient }));
        const instructionsArray = this.form.instructions.split('\n').map((step, index) => ({ number: index + 1, step }));
  
        // Construct the new recipe object
        const newRecipe = {
          title: this.form.title,
          image: this.form.image,
          readyInMinutes: this.form.readyInMinutes,
          servings: this.form.servings,
          extendedIngredients: ingredientsArray,
          analyzedInstructions: [{ name: "Instructions", steps: instructionsArray }],
          vegetarian: this.form.vegetarian,
          glutenFree: this.form.glutenFree,
          aggregateLikes: 0,
          isViewed: false,
          isFavorited: false,
        };
  
        // Save the new recipe (mock function)
        this.saveRecipe(newRecipe);
  
        // Clear the form
        this.form = {
          title: '',
          image: '',
          readyInMinutes: '',
          servings: '',
          ingredients: '',
          instructions: '',
          vegetarian: false,
          glutenFree: false,
        };
  
        // Close the modal
        this.$bvModal.hide('add-recipe-modal');
      },
      saveRecipe(recipe) {
        // This should be replaced with an actual API call to save the recipe to the database
        const savedRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
        savedRecipes.push({ id: Date.now(), ...recipe });
        localStorage.setItem('recipes', JSON.stringify(savedRecipes));
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add any additional styles if needed */
  </style>
  