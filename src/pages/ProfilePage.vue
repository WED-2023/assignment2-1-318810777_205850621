<template>
  <div class="profile-page">
    <h1>My Profile</h1>
    <b-button v-b-modal.add-recipe-modal variant="primary"
      >Create New Recipe</b-button
    >
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
