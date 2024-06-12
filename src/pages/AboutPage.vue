<template>
  <div class="about-container">
    <h1>About Us</h1>
    <p>
      Welcome to our recipe platform! Our mission is to provide you with a rich collection of recipes that you can explore and enjoy. Whether you are a novice cook or a seasoned chef, we have something for everyone. Dive into our curated selection of recipes, save your favorites, and share your culinary creations with your family and friends.
    </p>
    <p>
      We are committed to offering you the best user experience with detailed instructions, high-quality images, and tips to make your cooking journey enjoyable. Join us and be part of a vibrant community that loves to cook and share delicious food.
    </p>
  </div>
</template>

<script>
export default {
  name: "AboutPage",
};
</script>

<style scoped>
.about-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.about-container h1 {
  margin-bottom: 20px;
  font-size: 2em;
  color: #333;
}
.about-container p {
  margin-bottom: 15px;
  font-size: 1.2em;
  line-height: 1.6;
  color: #555;
}
</style>
