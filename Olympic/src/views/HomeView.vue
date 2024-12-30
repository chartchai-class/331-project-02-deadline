<template>
  <Navigation :menuItems="menuItems" />

  <div class="home-view flex justify-center items-start p-4">
    <div class="ranking-container w-full sm:w-3/5 md:w-2/5">
      <h1 class="text-4xl font-bold">Welcome to Olympic report application</h1>
      <RankingList :countries="paginatedCountries" @country-click="goToCountryDetail" />
    </div>
  </div>

  <div class="pagination flex justify-center gap-4 items-center mt-6">
    <button
      @click="previousPage"
      :disabled="currentPage === 1"
      class="pagination-btn"
      :class="{ 'cursor-not-allowed bg-gray-400': currentPage === 1 }"
    >
      Previous
    </button>
    <span>Page {{ currentPage }} of {{ totalPages }}</span>
    <button
      @click="nextPage"
      :disabled="currentPage === totalPages"
      class="pagination-btn"
      :class="{ 'cursor-not-allowed bg-gray-400': currentPage === totalPages }"
    >
      Next
    </button>
  </div>

  <div class="mt-6 text-center">
    <p>Enter a number to change the number of Country per page (1-10):</p>
    <div class="flex justify-center mt-4 gap-2">
      <input
        v-model="inputItemsPerPage"
        type="number"
        min="1"
        max="10"
        class="p-2 border rounded w-24 sm:w-32"
        placeholder="Items per page"
        @input="validateInput"
      />
      <button
        @click="updateItemsPerPage"
        class="ml-2 p-2 bg-blue-500 text-white rounded"
      >
        Update
      </button>
    </div>
    <p v-if="inputError" class="text-red-500 mt-2">Please enter a number between 1 and 10.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCountryStore } from '@/stores/countryStore';
import RankingList from '@/components/RankingList.vue';
import Navigation from '@/components/Navigation.vue';

export default defineComponent({
  name: 'HomeView',
  components: {
    RankingList,
    Navigation,
  },
  setup() {
    const router = useRouter();
    const countryStore = useCountryStore();

    const itemsPerPage = ref(5);
    const currentPage = ref(1);
    const inputItemsPerPage = ref(itemsPerPage.value);
    const inputError = ref(false);

    onMounted(() => {
      countryStore.fetchAllCountries();
    });

    const paginatedCountries = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage.value;
      return countryStore.countries.slice(startIndex, startIndex + itemsPerPage.value);
    });

    const totalPages = computed(() => {
      return Math.ceil(countryStore.countries.length / itemsPerPage.value);
    });

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const goToCountryDetail = (noc: string) => {
      router.push({ name: 'country-detail', params: { noc } });
    };

    const menuItems = [
      { name: 'Home', link: '/' },
      { name: 'About Us', link: '/team' },
      { name: 'Contact', link: '/contact' },
    ];

    const validateInput = () => {
      const input = inputItemsPerPage.value;
      if (input < 1) {
        inputItemsPerPage.value = 1;
      } else if (input > 10) {
        inputItemsPerPage.value = 10;
      }

      inputError.value = !(input >= 1 && input <= 10);
    };

    const updateItemsPerPage = () => {
      const newItemsPerPage = parseInt(inputItemsPerPage.value.toString(), 10);
      if (newItemsPerPage >= 1 && newItemsPerPage <= 10) {
        itemsPerPage.value = newItemsPerPage;
        currentPage.value = 1;
        inputError.value = false;
      } else {
        inputError.value = true;
      }
    };

    return {
      currentPage,
      totalPages,
      paginatedCountries,
      previousPage,
      nextPage,
      goToCountryDetail,
      menuItems,
      inputItemsPerPage,
      inputError,
      updateItemsPerPage,
      validateInput,
    };
  },
});
</script>

<style scoped>
.home-view {
  @apply max-w-full mx-auto p-4;
}

.ranking-container {
  @apply w-full sm:w-3/5 md:w-2/5;
}

.pagination {
  @apply flex justify-center gap-4 items-center mt-6;
}

.pagination-btn {
  @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700;
}

button:disabled {
  @apply bg-gray-400 cursor-not-allowed;
}

@media (max-width: 640px) {
  .pagination-btn {
    padding: 10px 16px;
  }

  .ranking-container {
    width: 100%;
  }
}
</style>
