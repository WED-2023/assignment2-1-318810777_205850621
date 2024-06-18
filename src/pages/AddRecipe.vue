<template>
  <div class="profile-page">
    <h1 class="text-center mb-3">Create New Recipe</h1>
    <AddRecipeModal />
    <!-- Other profile-related content -->
  </div>
</template>

<script>
import AddRecipeModal from "../components/AddRecipeModal.vue"; // Adjust the path as needed

export default {
  components: {
    AddRecipeModal,
  },
};
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
