<template>
  <div>
    <div v-if="country" class="country-info bg-blue-500 shadow-lg p-4 rounded-lg mb-5 max-w-2xl mx-auto sm:relative sm:left-0">
      <div class="flag-container">
        <img v-if="country.flagUrl" :src="country.flagUrl" alt="Country Flag" class="w-12 h-8 object-cover" />
        <h1 class="text-xl font-bold text-center">{{ country.enLongDescription }} ({{ country.noc }})</h1>
      </div>
      <p class="text-center">Rank: {{ country.rank }}</p>
    </div>

    <div v-if="country" class="competition-info bg-white shadow-lg p-4 rounded-lg mb-5 max-w-2xl mx-auto sm:relative sm:left-0 sm:top-1/3">
      <div class="medal-info mb-5">
        <h2 class="text-lg font-bold">Medal Summary</h2>
        <ul class="list-none p-0">
          <li class="mb-2">
            <div class="medal-container">
              <img src="../picture/gold.gif" alt="Gold Medal" class="medal-icon" />
              <span class="medal-text">Gold: {{ country.gold }}</span>
            </div>
          </li>
          <li class="mb-2">
            <div class="medal-container">
              <img src="../picture/silver.gif" alt="Silver Medal" class="medal-icon" />
              <span class="medal-text">Silver: {{ country.silver }}</span>
            </div>
          </li>
          <li class="mb-2">
            <div class="medal-container">
              <img src="../picture/bronze.gif" alt="Bronze Medal" class="medal-icon" />
              <span class="medal-text">Bronze: {{ country.bronze }}</span>
            </div>
          </li>
          <li>Total: {{ country.total }}</li>
        </ul>
      </div>
      <div class="rank-info">
        <h2 class="text-lg font-bold">Other Ranking Info</h2>
        <p>Sort Rank: {{ country.sortRank }}</p>
        <p>Total Rank: {{ country.rankTotal }}</p>
        <p>Sort Total Rank: {{ country.sortTotalRank }}</p>
      </div>
      <button
        v-if="isAdmin"
        @click="startEdit"
        class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mt-4"
      >
        Edit Country Details
      </button>
    </div>

    <div class="tabs bg-white shadow-lg p-4 rounded-lg mb-5 max-w-2xl mx-auto">
      <div class="tab-buttons flex flex-wrap mb-4">
        <button
          class="flex-1 px-4 py-2 text-center"
          :class="{ 'bg-blue-500 text-white': activeTab === 'sports', 'bg-gray-200': activeTab !== 'sports' }"
          @click="activeTab = 'sports'"
        >
          Sports
        </button>
        <button
          class="flex-1 px-4 py-2 text-center"
          :class="{ 'bg-blue-500 text-white': activeTab === 'comments', 'bg-gray-200': activeTab !== 'comments' }"
          @click="activeTab = 'comments'"
        >
          Comments
        </button>
      </div>

      <div v-show="activeTab === 'sports'" class="tab-content">
        <SportList :noc="noc" />
      </div>

      <div v-show="activeTab === 'comments'" class="tab-content">
        <CommentList :countryCode="noc" />
      </div>
    </div>

    <div v-if="editingCountry" class="edit-modal">
      <div class="modal-content p-4 bg-white shadow-lg rounded">
        <h3 class="text-lg font-bold mb-2">Edit Country Details</h3>
        <div class="medal-inputs mb-4">
          <label class="block mb-2">
            Rank:
            <input type="number" v-model="editingRank" class="input-field" />
          </label>
          <label class="block mb-2">
            Gold:
            <input type="number" v-model="editingGold" class="input-field" />
          </label>
          <label class="block mb-2">
            Silver:
            <input type="number" v-model="editingSilver" class="input-field" />
          </label>
          <label class="block mb-2">
            Bronze:
            <input type="number" v-model="editingBronze" class="input-field" />
          </label>
          <label class="block mb-2">
            Total:
            <input type="number" v-model="editingTotal" class="input-field" />
          </label>
          <label class="block mb-2">
            Sort Rank:
            <input type="number" v-model="editingSortRank" class="input-field" />
          </label>
          <label class="block mb-2">
            Total Rank:
            <input type="number" v-model="editingRankTotal" class="input-field" />
          </label>
          <label class="block mb-2">
            Sort Total Rank:
            <input type="number" v-model="editingSortTotalRank" class="input-field" />
          </label>
        </div>
        <div class="modal-actions flex gap-2">
          <button @click="saveEdit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Save
          </button>
          <button @click="cancelEdit" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import SportList from "@components/SportList.vue";
import CommentList from "@components/CommentList.vue";
import { useCountryStore } from "@/stores/countryStore";
import { useUserStore } from "@/stores/userStore";

export default defineComponent({
  name: "CountryDetail",
  components: {
    SportList,
    CommentList,
  },
  props: {
    noc: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const countryStore = useCountryStore();
    const userStore = useUserStore();
    const countryLoaded = ref(false);
    const editingCountry = ref(false);
    const activeTab = ref("sports");

    const editingRank = ref(0);
    const editingGold = ref(0);
    const editingSilver = ref(0);
    const editingBronze = ref(0);
    const editingTotal = ref(0);
    const editingSortRank = ref(0);
    const editingRankTotal = ref(0);
    const editingSortTotalRank = ref(0);

    onMounted(async () => {
      await countryStore.fetchCountryByNoc(props.noc);
      countryLoaded.value = true;
    });

    const country = computed(() => countryStore.selectedCountry);
    const isAdmin = computed(() => userStore.isAdmin);

    const startEdit = () => {
      if (country.value) {
        editingCountry.value = true;
        editingRank.value = country.value.rank;
        editingGold.value = country.value.gold;
        editingSilver.value = country.value.silver;
        editingBronze.value = country.value.bronze;
        editingTotal.value = country.value.total;
        editingSortRank.value = country.value.sortRank;
        editingRankTotal.value = country.value.rankTotal;
        editingSortTotalRank.value = country.value.sortTotalRank;
      }
    };

    const saveEdit = async () => {
      if (country.value) {
        await countryStore.updateCountry(props.noc, {
          rank: editingRank.value,
          gold: editingGold.value,
          silver: editingSilver.value,
          bronze: editingBronze.value,
          total: editingTotal.value,
          sortRank: editingSortRank.value,
          rankTotal: editingRankTotal.value,
          sortTotalRank: editingSortTotalRank.value,
        });
        editingCountry.value = false;
        await countryStore.fetchCountryByNoc(props.noc); // Refresh data after update
      }
    };

    const cancelEdit = () => {
      editingCountry.value = false;
    };

    return {
      country,
      noc: props.noc,
      countryLoaded,
      isAdmin,
      editingCountry,
      editingRank,
      editingGold,
      editingSilver,
      editingBronze,
      editingTotal,
      editingSortRank,
      editingRankTotal,
      editingSortTotalRank,
      activeTab,
      startEdit,
      saveEdit,
      cancelEdit,
    };
  },
});
</script>

<style scoped>
.flag-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
}

.medal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.medal-icon {
  margin-right: 8px;
}

.medal-text {
  text-align: center;
}

.tabs {
  display: flex;
  flex-direction: column;
}

.tab-buttons {
  display: flex;
  flex-wrap: wrap;
}

.tab-buttons button {
  border: none;
  cursor: pointer;
  padding: 10px;
  flex: 1 1 50%;
  transition: background 0.3s;
}

.tab-content {
  padding: 16px 0;
}

.edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

@media (min-width: 640px) {
  .tab-buttons button {
    flex: 1;
  }
}
</style>
