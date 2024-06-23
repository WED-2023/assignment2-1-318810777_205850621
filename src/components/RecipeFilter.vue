<template>
  <div class="filters">
    <b-form-group label="Dietary Preferences">
      <b-form-checkbox v-model="filters.vegetarian">Vegetarian</b-form-checkbox>
      <b-form-checkbox v-model="filters.vegan">Vegan</b-form-checkbox>
      <b-form-checkbox v-model="filters.glutenFree">Gluten-Free</b-form-checkbox>
    </b-form-group>
    <b-button @click="applyFilters">Apply Filters</b-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filters: {
        vegetarian: false,
        vegan: false,
        glutenFree: false,
      },
    };
  },
  methods: {
    applyFilters() {
      this.$emit('apply-filters', this.filters);
    },
  },
};
</script>

<style scoped>
.filters {
  margin-bottom: 20px;
}
</style>
