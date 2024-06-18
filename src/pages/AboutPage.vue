<template>
  <div class="about-container">
    <h1>About Us</h1>
    <p>
      Welcome to our recipe platform! Our mission is to provide you with a rich
      collection of recipes that you can explore and enjoy. Whether you are a
      novice cook or a seasoned chef, we have something for everyone. Dive into
      our curated selection of recipes, save your favorites, and share your
      culinary creations with your family and friends.
    </p>
    <p>
      We are committed to offering you the best user experience with detailed
      instructions, high-quality images, and tips to make your cooking journey
      enjoyable. Join us and be part of a vibrant community that loves to cook
      and share delicious food.
    </p>
    <p>
      Our development team is dedicated to constantly improving this platform.
      We have worked on various exercises to enhance our skills and bring the
      best features to you. You can check out our previous exercises on our
      <a href="https://github.com/WED-2023/205850621" target="_blank"
        >GitHub repository</a
      >.
    </p>

    <p></p>
    <h1>Ido Kraicer</h1>
    <p>
      Ido Kraicer is a full-stack developer with a passion for creating web
      applications. He enjoys working with modern technologies and frameworks to
      build scalable and user-friendly applications. <br />
      Ido is always eager to learn new things and improve his skills. You can
      find more about Ido on his
      <a href="https://github.com/idokraicer" target="_blank">GitHub page</a>
      and you're welcome to visit his last website project in WED-2023:
      <a
        href="https://wed-2023.github.io/assignment1-idokraicer/"
        target="_blank"
        >Assignment 1</a
      >
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

.about-container a {
  padding: 0;
  font-size: 1em;
  color: #007bff !important;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  text-decoration: none;
}

.about-container a:after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  background: #007bff;
  transition: width 0.3s;
  bottom: -0px;
  left: 0;
}

.about-container a:hover:after {
  width: 90%;
  transition: width 0.3s ease-in-out;
}
</style>
