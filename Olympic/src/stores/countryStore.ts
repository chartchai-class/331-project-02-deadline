import { defineStore } from 'pinia';
import axios from 'axios';

interface Country {
  id: number;
  noc: string;
  rank: number;
  sortRank: number;
  rankTotal: number;
  sortTotalRank: number;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
  enDescription: string;
  enLongDescription: string;
  flagUrl: string;
}

interface CountryState {
  countries: Country[];
  selectedCountry: Country | null;
  isAdminMode: boolean; // 用于切换管理员模式
}

export const useCountryStore = defineStore('countryStore', {
  state: (): CountryState => ({
    countries: [],
    selectedCountry: null,
    isAdminMode: false,
  }),

  actions: {
    async fetchAllCountries() {
      try {
        const response = await axios.get<Country[]>('http://localhost:8081/api/countries');
        this.countries = response.data;
      } catch (error) {
        console.error('Failed to fetch countries', error);
        this.countries = [];
      }
    },

    async fetchCountryByNoc(noc: string) {
      try {
        const response = await axios.get<Country>(`http://localhost:8081/api/countries/${noc}`);
        this.selectedCountry = response.data;
      } catch (error) {
        console.error(`Failed to fetch country with NOC: ${noc}`, error);
      }
    },

    async updateCountry(
      noc: string,
      updatedData: {
        rank?: number;
        sortRank?: number;
        rankTotal?: number;
        sortTotalRank?: number;
        gold?: number;
        silver?: number;
        bronze?: number;
        total?: number;
      }
    ) {
      try {
        const response = await axios.put<Country>(`http://localhost:8081/api/countries/${noc}`, updatedData);
        const index = this.countries.findIndex((country) => country.noc === noc);
        if (index !== -1) {
          this.countries[index] = { ...this.countries[index], ...response.data };
        }
        if (this.selectedCountry?.noc === noc) {
          this.selectedCountry = { ...this.selectedCountry, ...response.data };
        }
      } catch (error) {
        console.error(`Failed to update data for country with NOC: ${noc}`, error);
      }
    },

    async addCountry(newCountry: {
      noc: string;
      enLongDescription: string;
      rank: number;
      sortRank: number;
      rankTotal: number;
      sortTotalRank: number;
      gold: number;
      silver: number;
      bronze: number;
      total: number;
    }) {
      try {
        const response = await axios.post<Country>('http://localhost:8081/api/countries', newCountry);
        this.countries.push(response.data);
      } catch (error) {
        console.error('Failed to add new country', error);
      }
    },

    toggleAdminMode() {
      this.isAdminMode = !this.isAdminMode;
    },
  },
});
