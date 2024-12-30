<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="register-container bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Register</h1>
      <Form :validation-schema="schema" @submit="handleRegister" v-slot="{ errors }" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username:</label>
          <Field
            name="username"
            type="text"
            placeholder="Enter a username"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
          <ErrorMessage name="username" class="text-red-500 text-sm mt-1" />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email:</label>
          <Field
            name="email"
            type="email"
            placeholder="Enter your email"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
          <ErrorMessage name="email" class="text-red-500 text-sm mt-1" />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password:</label>
          <Field
            name="password"
            type="password"
            placeholder="Enter a password"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
          <ErrorMessage name="password" class="text-red-500 text-sm mt-1" />
        </div>
        <button
          type="submit"
          class="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Register
        </button>
        <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
        <p v-if="successMessage" class="text-green-500 text-sm mt-2">{{ successMessage }}</p>
      </Form>
      <p class="mt-4 text-center text-sm text-gray-600">
        Already have an account?
        <router-link to="/login" class="text-blue-500 hover:underline">Login here</router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import axios from "axios";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default defineComponent({
  components: { Form, Field, ErrorMessage },
  setup() {
    const errorMessage = ref("");
    const successMessage = ref("");

    // 定义验证规则
    const schema = yup.object({
      username: yup.string().required("Username is required"),
      email: yup.string().email("Invalid email address").required("Email is required"),
      password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    });

    const handleRegister = async (values: any) => {
      try {
        const response = await axios.post(
          "http://localhost:8081/api/users/register",
          values,
          { headers: { "Content-Type": "application/json" } }
        );
        successMessage.value = response.data.message || "Registration successful!";
        errorMessage.value = "";
      } catch (error: any) {
        if (error.response?.status === 409) {
          errorMessage.value = "Username already exists. Please choose another one.";
        } else {
          errorMessage.value = error.response?.data?.message || "An error occurred. Please try again.";
        }
        successMessage.value = "";
      }
    };

    return {
      errorMessage,
      successMessage,
      schema,
      handleRegister,
    };
  },
});
</script>

<style scoped>
.register-container {
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
</style>
