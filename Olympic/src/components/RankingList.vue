<template>
  <div class="w-full max-w-4xl mx-auto">

    <div class="grid grid-cols-5 font-bold py-3 px-0 border-b bg-blue-100 text-center text-blue-800">
      <span>Rank</span>
      <span>Country</span>
      <span>Gold</span>
      <span>Silver</span>
      <span>Bronze</span>
    </div>


    <div class="ranking-list bg-white shadow-md rounded-lg">
      <ul>
        <li
          v-for="country in countries"
          :key="country.noc"
          @click="onCountryClick(country.noc)"
          class="grid grid-cols-5 items-center py-3 px-4 cursor-pointer border-b last:border-none hover:bg-gray-100 transition"
        >

          <span class="text-center font-medium text-gray-700">{{ country.rank }}</span>

          <span class="flex items-center gap-3 text-left font-medium text-gray-700">
            <img :src="country.flagUrl" alt="Flag" class="w-10 h-6 object-cover rounded shadow-md" />
            <span>{{ country.enDescription }}</span>
          </span>

          <span class="text-center font-medium text-yellow-600">{{ country.gold }}</span>
          <span class="text-center font-medium text-gray-600">{{ country.silver }}</span>
          <span class="text-center font-medium text-orange-600">{{ country.bronze }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

interface Country {
  noc: string;
  rank: number;
  gold: number;
  silver: number;
  bronze: number;
  enDescription: string;
  flagUrl: string;
}

export default defineComponent({
  name: "RankingList",
  props: {
    countries: {
      type: Array as PropType<Country[]>,
      required: true,
    },
  },
  emits: ["country-click"],
  methods: {
    onCountryClick(noc: string) {
      this.$emit("country-click", noc);
    },
  },
});
</script>

<style scoped>
.ranking-list {
  border-radius: 0.5rem;
}
</style>
