<template>
  <div class="login-container">
    <div class="image-section"></div>
    <div class="login-form-section">
      <div class="login-form">
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
            <b-form-invalid-feedback
              >Username is required</b-form-invalid-feedback
            >
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
            <b-form-invalid-feedback
              >Password is required</b-form-invalid-feedback
            >
          </b-form-group>

          <b-button type="submit" variant="primary" class="w-100"
            >Login</b-button
          >
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
        invalidCredentials: false,
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
        if (!this.form.password || !this.form.username) {
          console.error("Invalid credentials");
          this.form.invalidCredentials = true;
          this.form.submitError = "Invalid credentials";
          return;
        }
        const response = await mockLogin({
          username: this.form.username,
          password: this.form.password,
        }).response;
        console.log("Response", response);
        this.form.invalidCredentials = response.data.invalidCredentials;
        if (response.data.invalidCredentials) {
          console.error("Invalid credentials");
          console.error(response.data);
          console.warn(this.form.invalidCredentials);
          this.form.submitError = response.data.message;
          return;
        }
        if (!response.data.success) {
          console.error("Login failed");
          console.error(response.data);
          this.form.submitError = response.data.message;
          return;
        }
        this.$root.store.login(this.form.username);
        this.$router.push("/");
      } catch (err) {
        console.error(err);
        this.form.submitError = err.data.message;
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
  align-items: center;
  margin: auto;
}
.login-form {
  background-color: rgba(255, 255, 255, 0.991);
}
</style>
