<template>
  <!-- <b-modal id="add-recipe-modal" scrollable title="Create New Recipe" size="lg"> -->
  <b-form @submit.stop.prevent="onSubmit" class="recipe-form gradient-effect">
    <b-form-group label="Title" label-for="title">
      <b-form-input id="title" v-model="form.title" required></b-form-input>
    </b-form-group>

    <b-form-group label="Image URL" label-for="image">
      <b-form-input id="image" v-model="form.image" required></b-form-input>
    </b-form-group>

    <b-form-row>
      <b-col>
        <b-form-group label="Ready In Minutes" label-for="readyInMinutes">
          <b-form-input
            id="readyInMinutes"
            v-model="form.readyInMinutes"
            type="number"
            min="5"
            required
          ></b-form-input>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group label="Servings" label-for="servings">
          <b-form-input
            id="servings"
            v-model="form.servings"
            type="number"
            min="1"
            required
          ></b-form-input>
        </b-form-group>
      </b-col>
    </b-form-row>

    <b-form-group label="Ingredients" label-for="ingredients">
      <div class="textarea-container">
        <div class="line-numbers" ref="lineNumbersIngredients">
          {{ lineNumbers }}
        </div>
        <b-form-textarea
          id="ingredients"
          v-model="form.ingredients"
          placeholder="List each ingredient on a new line"
          rows="5"
          required
          @input="updateLineNumbers"
          @scroll="syncScroll('ingredients')"
        ></b-form-textarea>
      </div>
    </b-form-group>

    <b-form-group label="Instructions" label-for="instructions">
      <div class="textarea-container">
        <div class="line-numbers" ref="lineNumbersInstructions">
          {{ lineNumbersInstructions }}
        </div>
        <b-form-textarea
          id="instructions"
          v-model="form.instructions"
          placeholder="List each step on a new line"
          rows="5"
          required
          @input="updateLineNumbersInstructions"
          @scroll="syncScroll('instructions')"
        ></b-form-textarea>
      </div>
    </b-form-group>

    <b-form-group
      label="Dietary Options"
      label-for="dietaryOptions"
      class="dietary-options"
    >
      <b-form-checkbox-group v-model="form.dietaryOptions" switches>
        <b-form-checkbox value="vegetarian">Vegetarian</b-form-checkbox>
        <b-form-checkbox value="vegan">Vegan</b-form-checkbox>
        <b-form-checkbox value="glutenFree">Gluten-Free</b-form-checkbox>
      </b-form-checkbox-group>
    </b-form-group>

    <div class="button-wrapper">
      <b-button variant="primary" @click="onSubmit">Submit Recipe</b-button>
    </div>
  </b-form>
  <!-- </b-modal> -->
</template>

<script>
export default {
  data() {
    return {
      form: {
        title: "",
        image: "",
        readyInMinutes: "",
        servings: "",
        ingredients: "",
        instructions: "",
        dietaryOptions: [],
      },
      lineNumbers: "",
      lineNumbersInstructions: "",
    };
  },
  mounted() {
    this.updateLineNumbers();
    this.updateLineNumbersInstructions();
  },
  methods: {
    updateLineNumbers() {
      this.lineNumbers = this.generateLineNumbers(this.form.ingredients);
      this.$nextTick(() => {
        this.syncScroll("ingredients");
      });
    },
    updateLineNumbersInstructions() {
      this.lineNumbersInstructions = this.generateLineNumbers(
        this.form.instructions
      );
      this.$nextTick(() => {
        this.syncScroll("instructions");
      });
    },
    generateLineNumbers(text) {
      const lines = text.split("\n");
      return lines.map((line, index) => index + 1).join("\n") + "\n";
    },
    syncScroll(id) {
      const textarea = document.getElementById(id);
      const lineNumbers =
        id === "ingredients"
          ? this.$refs.lineNumbersIngredients
          : this.$refs.lineNumbersInstructions;
      lineNumbers.scrollTop = textarea.scrollTop;
    },
    onSubmit() {
      // Convert ingredients and instructions to arrays
      const ingredientsArray = this.form.ingredients
        .split("\n")
        .map((ingredient) => ({ original: ingredient }));
      const instructionsArray = this.form.instructions
        .split("\n")
        .map((step, index) => ({ number: index + 1, step }));

      // Construct the new recipe object
      const newRecipe = {
        title: this.form.title,
        image: this.form.image,
        readyInMinutes: this.form.readyInMinutes,
        servings: this.form.servings,
        extendedIngredients: ingredientsArray,
        analyzedInstructions: [
          { name: "Instructions", steps: instructionsArray },
        ],
        instructions: instructionsArray.map((step) => step.step).join("\n"),
        vegetarian: this.form.dietaryOptions.includes("vegetarian"),
        glutenFree: this.form.dietaryOptions.includes("glutenFree"),
        vegan: this.form.dietaryOptions.includes("vegan"),
        aggregateLikes: 0,
        isViewed: false,
        isFavorited: false,
      };

      // Save the new recipe (mock function)
      this.saveRecipe(newRecipe);

      // Clear the form
      this.resetForm();

      // Close the modal
      this.$bvModal.hide("add-recipe-modal");
    },
    saveRecipe(recipe) {
      // This should be replaced with an actual API call to save the recipe to the database
      // const savedRecipes = JSON.parse(localStorage.getItem("recipes") || "[]");
      // savedRecipes.push({ id: Date.now(), ...recipe });
      // localStorage.setItem("recipes", JSON.stringify(savedRecipes));
      this.$root.store.myRecipes.push(recipe);

      this.$root.toast("Success", "Recipe added successfully", "success");
    },
    resetForm() {
      this.form = {
        title: "",
        image: "",
        readyInMinutes: "",
        servings: "",
        ingredients: "",
        instructions: "",
        dietaryOptions: [],
      };
      this.updateLineNumbers();
      this.updateLineNumbersInstructions();
    },
  },
};
</script>

<style scoped>
.recipe-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.recipe-form .dietary-options {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 20px;
}

.recipe-form .b-form-group {
  margin-bottom: 20px;
}

.recipe-form .button-wrapper {
  text-align: center;
  margin-top: 30px;
}

.recipe-form .b-button {
  padding: 10px 20px;
  font-size: 16px;
}

.recipe-form textarea {
  resize: none;
}

.textarea-container {
  display: flex;
  position: relative;
  font-size: 16px;
}

.line-numbers {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 40px;
  padding: 8px;
  background-color: #f1f1f1;
  text-align: right;
  border-right: 1px solid #ddd;
  color: #666;
  font-size: 16px;
  line-height: 1.5em;
  overflow-y: hidden;
  height: 100%;
  white-space: pre;
  border-radius: 8px 0 0 8px;
}

.textarea-container textarea {
  padding-left: 50px;
  width: 100%;
  box-sizing: border-box;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  line-height: 1.5em;
}
</style>
