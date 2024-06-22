<template>
  <div class="login-container">
    <div class="image-section"></div>
    <div class="login-form-section">
      <div class="login-form">
        <img src="@/assets/logo.webp" alt="Logo" class="logo" />
        <h1 class="title">Login</h1>
        <b-form @submit.prevent="onLogin">
          <b-form-group
            id="input-group-Username"
            label-cols-sm="3"
            label="Username:"
            label-for="Username"
          >
            <b-form-input
              id="Username"
              v-model="$v.form.username.$model"
              type="text"
              :state="validateState('username')"
            ></b-form-input>
            <b-form-invalid-feedback>Username is required</b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            id="input-group-Password"
            label-cols-sm="3"
            label="Password:"
            label-for="Password"
          >
            <b-form-input
              id="Password"
              type="password"
              v-model="$v.form.password.$model"
              :state="validateState('password')"
            ></b-form-input>
            <b-form-invalid-feedback>Password is required</b-form-invalid-feedback>
          </b-form-group>

          <b-button type="submit" variant="primary" class="w-100 mt-4">Login</b-button>
          <div class="mt-2">
            Do not have an account yet?
            <router-link to="register">Register here</router-link>
          </div>
        </b-form>
        <b-alert
          class="mt-2"
          v-if="form.submitError"
          variant="warning"
          dismissible
          show
        >
          Login failed: {{ form.submitError }}
        </b-alert>
      </div>
    </div>
  </div>
</template>
<script>
import { required } from "vuelidate/lib/validators";
import { mockLogin } from "../services/auth.js";

export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "",
        password: "",
        submitError: undefined,
      },
    };
  },
  validations: {
    form: {
      username: { required },
      password: { required },
    },
  },
  methods: {
    validateState(param) {
      const { $dirty, $error } = this.$v.form[param];
      return $dirty ? !$error : null;
    },
    async login() {
      try {
        const response = await mockLogin({
          username: this.form.username,
          password: this.form.password,
        });

        if (response.response.data.success && response.status === 200) {
          this.$root.store.login(this.form.username);
          this.$router.push("/");
        } else {
          this.form.submitError = response.response.data.message;
        }
      } catch (err) {
        this.form.submitError = err.response.data.message;
      }
    },
    onLogin() {
      this.form.submitError = undefined;
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.login();
    },
  },
};
</script>

<style scoped>
.login-container {
  display: grid;
  position: absolute;
  inset: 0;
  grid-template-columns: 1fr 1fr;
  height: 100%;
  width: 100%;
}

.image-section {
  background-image: url("@/assets/copy-space-italian-food-ingredients.jpg");
  background-size: cover;
}

.login-form-section {
  display: flex;
  height: 100vh;
  width: 100%;
  justify-content: center;
  align-items: flex-start; /* Changed to flex-start */
  padding-top: 50px; /* Added padding to move the form down */
  margin: auto;
}

.login-form {
  background-color: rgba(255, 255, 255, 0.991);
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
}

.logo {
  display: block;
  margin: 75px auto 30px; /* Adjusted margin to make logo bigger */
  max-width: 200px;
}

.title {
  text-align: center;
  margin-bottom: 20px;
}
</style>
