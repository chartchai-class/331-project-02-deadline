import { defineStore } from 'pinia';
import axios from 'axios';

interface Discipline {
  id: number;
  name: string;
  gold: number;
  silver: number;
  bronze: number;
}

interface SportState {
  disciplines: Discipline[];
}

export const useSportStore = defineStore('sportStore', {
  state: (): SportState => ({
    disciplines: [],
  }),

  actions: {
    async fetchDisciplines(noc: string) {
      try {
        const response = await axios.get(`http://localhost:8081/api/sports/${noc}`);
        this.disciplines = response.data.map((item: any) => ({
          id: item.id,
          name: item.disciplineName,
          gold: item.gold,
          silver: item.silver,
          bronze: item.bronze,
        }));
      } catch (error) {
        console.error('Failed to fetch disciplines:', error);
        this.disciplines = [];
      }
    },

    async updateMedals(
      noc: string,
      sportId: number,
      updatedData: { gold: number; silver: number; bronze: number }
    ) {
      try {
        const response = await axios.put(
          `http://localhost:8081/api/sports/${noc}/${sportId}`,
          updatedData
        );
        if (response.status === 200) {
          const index = this.disciplines.findIndex((sport) => sport.id === sportId);
          if (index !== -1) {
            this.disciplines[index] = { ...this.disciplines[index], ...updatedData };
          }
        }
      } catch (error) {
        console.error('Failed to update medals:', error);
      }
    },
  },
});
