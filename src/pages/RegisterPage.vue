<template>
  <div class="register-container">
    <div class="image-section"></div>
    <div class="register-form-section">
      <div class="register-form">
        <h1 class="title">Register</h1>
        <b-form @submit.prevent="onRegister" @reset.prevent="onReset">
          <b-form-group
            label="Username"
            label-for="username"
            label-cols-md="4"
            label-cols-lg="4"
          >
            <b-form-input
              id="username"
              v-model="$v.form.username.$model"
              :state="validateState('username')"
              @blur="checkUsername"
            ></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.username.required">
              Username is required
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-if="form.usernameIsTaken">
              Username is already taken
            </b-form-invalid-feedback>
            <b-form-invalid-feedback
              v-else-if="
                !$v.form.username.minLength || !$v.form.username.maxLength
              "
            >
              Username length should be between 3-8 characters long
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-if="!$v.form.username.alpha">
              Username should contain only letters
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            label="First Name"
            label-for="firstName"
            label-cols-md="4"
            label-cols-lg="4"
          >
            <b-form-input
              id="firstName"
              v-model="$v.form.firstName.$model"
              :state="validateState('firstName')"
            ></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.firstName.required">
              First name is required
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            label="Last Name"
            label-for="lastName"
            label-cols-md="4"
            label-cols-lg="4"
          >
            <b-form-input
              id="lastName"
              v-model="$v.form.lastName.$model"
              :state="validateState('lastName')"
            ></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.lastName.required">
              Last name is required
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            label="Country"
            label-for="country"
            label-cols-md="4"
            label-cols-lg="4"
          >
            <b-form-select
              id="country"
              v-model="$v.form.country.$model"
              :options="countries"
              :state="validateState('country')"
            ></b-form-select>
            <b-form-invalid-feedback>
              Country is required
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            label="Email"
            label-for="email"
            label-cols-md="4"
            label-cols-lg="4"
          >
            <b-form-input
              id="email"
              type="email"
              v-model="$v.form.email.$model"
              :state="validateState('email')"
            ></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.email.required">
              Email is required
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-if="!$v.form.email.email">
              Enter a valid email
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            label="Password"
            label-for="password"
            label-cols-md="4"
            label-cols-lg="4"
          >
            <b-form-input
              id="password"
              type="password"
              v-model="$v.form.password.$model"
              :state="validateState('password')"
            ></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.password.required">
              Password is required
            </b-form-invalid-feedback>
            <b-form-invalid-feedback
              v-if="
                !$v.form.password.minLength ||
                  !$v.form.password.maxLength ||
                  !$v.form.password.validPassword
              "
            >
              Password must be 5-10 characters long, contain at least one number
              and one special character
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            label="Confirm Password"
            label-for="confirmPassword"
            label-cols-md="4"
            label-cols-lg="4"
          >
            <b-form-input
              id="confirmPassword"
              type="password"
              v-model="$v.form.confirmPassword.$model"
              :state="validateState('confirmPassword')"
            ></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.confirmPassword.required">
              Password confirmation is required
            </b-form-invalid-feedback>
            <b-form-invalid-feedback
              v-if="!$v.form.confirmPassword.sameAsPassword"
            >
              Passwords must match
            </b-form-invalid-feedback>
          </b-form-group>

          <div class="buttons">
            <b-button type="reset" variant="danger">Reset</b-button>
            <b-button type="submit" variant="primary" class="ml-3"
              >Register</b-button
            >
          </div>
          <div class="mt-2 text-center">
            Already have an account?
            <router-link to="login">Log in here</router-link>
          </div>
        </b-form>
        <b-alert
          class="mt-2"
          v-if="form.submitError"
          variant="warning"
          dismissible
          show
        >
          Register failed: {{ form.submitError }}
        </b-alert>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {
  required,
  minLength,
  maxLength,
  alpha,
  email,
  sameAs,
} from "vuelidate/lib/validators";

import { mockGetUser } from "../services/auth.js";

const passwordValidation = (value) => {
  return /[0-9]/.test(value) && /[!@#$%^&*(),.?":{}|<>]/.test(value);
};

export default {
  name: "Register",
  data() {
    return {
      form: {
        username: "",
        firstName: "",
        lastName: "",
        country: null,
        email: "",
        password: "",
        confirmPassword: "",
        submitError: undefined,
        usernameIsTaken: false,
      },
      countries: [],
    };
  },
  validations: {
    form: {
      username: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(8),
        alpha,
        isTaken(value) {
          return !this.form.usernameIsTaken;
        },
      },
      firstName: { required },
      lastName: { required },
      country: { required },
      email: { required, email },
      password: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(10),
        validPassword: passwordValidation,
      },
      confirmPassword: {
        required,
        sameAsPassword: sameAs("password"),
      },
    },
  },
  mounted() {
    this.fetchCountries();
  },
  methods: {
    fetchCountries() {
      axios
        .get("https://restcountries.com/v3.1/all")
        .then((response) => {
          this.countries = response.data
            .map((country) => ({
              value: country.name.common,
              text: country.name.common,
            }))
            .sort((a, b) => a.text.localeCompare(b.text));
        })
        .catch((error) => {
          console.error("Error fetching countries:", error);
        });
    },
    validateState(param) {
      const { $dirty, $error } = this.$v.form[param];
      return $dirty ? !$error : null;
    },
    async register() {
      try {
        const userDetails = {
          username: this.form.username,
          firstName: this.form.firstName,
          lastName: this.form.lastName,
          country: this.form.country,
          email: this.form.email,
          password: this.form.password,
        };
        // Add your registration logic here
        this.$router.push("/login");
      } catch (err) {
        this.form.submitError = err.response.data.message;
      }
    },
    onRegister() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.register();
    },
    onReset() {
      this.form = {
        username: "",
        firstName: "",
        lastName: "",
        country: null,
        email: "",
        password: "",
        confirmPassword: "",
        submitError: undefined,
      };
      this.$nextTick(() => {
        this.$v.$reset();
      });
    },
    async checkUsername() {
      if (
        !this.$v.form.username.required ||
        !this.$v.form.username.alpha ||
        !this.$v.form.username.minLength ||
        !this.$v.form.username.maxLength
      ) {
        console.log("out");
        return;
      }
      try {
        const response = mockGetUser(this.form.username);
        console.log(response);
        if (response.status === 200) {
          this.form.usernameIsTaken = true;
        } else {
          this.form.usernameIsTaken = false;
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  height: 100vh;
  width: 100vw;
}
.image-section {
  flex: 1;
  background: url("@/assets/pexels-vanmalidate-784633.jpg") no-repeat center
    center;
  background-size: cover;
}
.register-form-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.register-form {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 8px;
  max-width: 450px;
  width: 100%;
}
.title {
  text-align: center;
  margin-bottom: 20px;
}
.buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
