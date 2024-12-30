<template>
  <nav class="bg-gray-800 text-white fixed w-full top-0 left-0 z-50 p-3">
    <ul class="flex items-center gap-4">
      <li v-for="item in menuItems" :key="item.name">
        <a :href="item.link" class="hover:underline">{{ item.name }}</a>
      </li>
      <li class="relative flex items-center gap-2">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Enter country name..."
          @keyup="filterSuggestions"
          @focus="showSuggestions"
          @blur="hideSuggestions"
          class="px-3 py-2 border border-gray-300 rounded w-48 focus:outline-none focus:ring focus:ring-blue-300 text-black"
        />
        <button
          @click="searchCountry(searchQuery)"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-black rounded"
        >
          Search
        </button>
        <ul
          v-if="showList && filteredSuggestions.length"
          class="absolute top-12 left-0 w-full bg-white border border-gray-300 rounded shadow max-h-40 overflow-y-auto z-50"
        >
          <li
            v-for="suggestion in filteredSuggestions"
            :key="suggestion.noc"
            @click="selectSuggestion(suggestion)"
            class="px-3 py-2 cursor-pointer hover:bg-blue-500 hover:text-white text-black"
          >
            {{ suggestion.enDescription }}
          </li>
        </ul>
      </li>
      <li class="relative">
        <button
          v-if="!userStore.isLoggedIn"
          @click="navigateToLogin"
          class="px-4 py-2 bg-green-500 hover:bg-green-600 rounded"
        >
          Login
        </button>
        <div v-else class="flex items-center gap-2">
          <span>Welcome, {{ userStore.userNickname }}</span>
          <button @click="logout" class="px-4 py-2 bg-red-500 hover:bg-red-600 rounded">
            Logout
          </button>
          <button
            v-if="userStore.isAdmin"
            @click="navigateToAdmin"
            class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded"
          >
            Manage Users
          </button>

          <button
            v-if="userStore.isAdmin"
            @click="navigateToAddCountry"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
          >
            Add Country
          </button>
        </div>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import { useCountryStore } from "@/stores/countryStore";

export default defineComponent({
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const countryStore = useCountryStore();

    const searchQuery = ref<string>("");
    const showList = ref(false);

    const filteredSuggestions = computed(() =>
      countryStore.countries.filter((country) =>
        country.enDescription.toLowerCase().startsWith(searchQuery.value.toLowerCase())
      )
    );

    const filterSuggestions = () => {
      showList.value = searchQuery.value.trim().length > 0;
    };

    const selectSuggestion = (suggestion: { noc: string; enDescription: string }) => {
      searchQuery.value = suggestion.enDescription;
      searchCountry(suggestion.noc);
    };

    const searchCountry = (noc: string) => {
      if (noc) {
        router.push({ name: "country-detail", params: { noc } });
        searchQuery.value = "";
        showList.value = false;
      }
    };

    const showSuggestions = () => {
      showList.value = true;
    };

    const hideSuggestions = () => {
      setTimeout(() => {
        showList.value = false;
      }, 200);
    };

    const navigateToLogin = () => {
      router.push("/login");
    };

    const logout = async () => {
      await userStore.logout();
      router.push("/");
    };

    const navigateToAdmin = () => {
      router.push("/admin");
    };

    const navigateToAddCountry = () => {
      router.push("/addcountryinfo");
    };

    onMounted(() => {
      userStore.fetchUser();
      countryStore.fetchAllCountries(); // 动态加载国家数据
    });

    const menuItems = [
      { name: "Home", link: "/" },
      { name: "About Us", link: "/team" },
      { name: "Contact", link: "/contact" },
    ];

    return {
      userStore,
      searchQuery,
      filteredSuggestions,
      showList,
      filterSuggestions,
      searchCountry,
      selectSuggestion,
      showSuggestions,
      hideSuggestions,
      menuItems,
      navigateToLogin,
      logout,
      navigateToAdmin,
      navigateToAddCountry,
    };
  },
});
</script>

<style scoped>
nav a {
  color: white;
  text-decoration: none;
  padding: 0 8px;
}

nav a:hover {
  text-decoration: underline;
}

button {
  color: black;
  padding: 8px 12px;
  margin-left: 4px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}
button:hover {
  background-color: #4a90e2;
  box-shadow: none;
}

ul li:hover {
  background-color: transparent;
  color: white;
  border-radius: 4px;
  box-shadow: none;
}

ul li {
  margin: 4px 0;
}
</style>
