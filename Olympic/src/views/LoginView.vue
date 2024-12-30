<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="login-container bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Login</h1>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username:</label>
          <input
            id="username"
            v-model="username"
            placeholder="Enter username"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
          <span class="text-red-500 text-sm mt-1" v-if="errors.username">{{ errors.username }}</span>
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password:</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
          <span class="text-red-500 text-sm mt-1" v-if="errors.password">{{ errors.password }}</span>
        </div>
        <button
          type="submit"
          class="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Login
        </button>
        <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
      </form>
      <p class="mt-4 text-center text-sm text-gray-600">
        Don't have an account?
        <router-link to="/register" class="text-blue-500 hover:underline">Register here</router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useField, useForm } from "vee-validate";
import { required } from "@vee-validate/rules";
import axios from "axios";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const router = useRouter();
    const { errors } = useForm();
    const { value: username } = useField("username", required);
    const { value: password } = useField("password", required);
    const errorMessage = ref("");

    const handleLogin = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8081/api/users/login",
          { username: username.value, password: password.value },
          {
            withCredentials: true,
          }
        );
        alert(response.data.message || "Login successful!");
        router.push("/"); // 跳转到首页
      } catch (error: any) {
        if (error.response && error.response.data) {
          errorMessage.value = error.response.data.message;
        } else {
          errorMessage.value = "An error occurred. Please try again.";
        }
      }
    };

    return { username, password, handleLogin, errorMessage, errors };
  },
});
</script>

<style scoped>
.error {
  margin-top: 10px;
}
</style>
