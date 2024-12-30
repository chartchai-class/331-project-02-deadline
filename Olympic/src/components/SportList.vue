<template>
  <div class="sport-list-container p-5">
    <h2 class="text-2xl font-bold mb-4">Sports</h2>
    <ul class="sport-list list-none p-0 m-0">
      <li
        v-for="sport in paginatedDisciplines"
        :key="sport.id"
        class="flex justify-between items-center p-4 mb-4 bg-gray-100 rounded-md"
      >
        <span class="sport-name text-lg font-medium">{{ sport.name }}</span>
        <span class="medal-summary text-sm flex gap-4">
          <span class="text-gray-600">Gold: {{ sport.gold }}</span>
          <span class="text-gray-600">Silver: {{ sport.silver }}</span>
          <span class="text-gray-600">Bronze: {{ sport.bronze }}</span>
        </span>
        <button
          v-if="isAdmin"
          @click="startEdit(sport)"
          class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
        >
          Edit
        </button>
      </li>
    </ul>
    <div class="pagination flex justify-between items-center mt-4">
      <button
        :disabled="currentPage === 1"
        @click="prevPage"
        class="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        :disabled="currentPage === totalPages"
        @click="nextPage"
        class="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
      >
        Next
      </button>
    </div>

    <div v-if="editingSport" class="edit-modal">
      <div class="modal-content p-4 bg-white shadow-lg rounded">
        <h3 class="text-lg font-bold mb-2">
          Edit Medals for {{ editingSport.name }}
        </h3>
        <form @submit.prevent="saveEdit">
          <div class="medal-inputs mb-4">
            <label class="block mb-2">
              Gold:
              <Field type="number" name="gold" v-model="editingGold" class="input-field" />
              <ErrorMessage name="gold" class="text-red-500 text-sm" />
            </label>
            <label class="block mb-2">
              Silver:
              <Field type="number" name="silver" v-model="editingSilver" class="input-field" />
              <ErrorMessage name="silver" class="text-red-500 text-sm" />
            </label>
            <label class="block mb-2">
              Bronze:
              <Field type="number" name="bronze" v-model="editingBronze" class="input-field" />
              <ErrorMessage name="bronze" class="text-red-500 text-sm" />
            </label>
          </div>
          <div class="modal-actions flex gap-2">
            <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Save
            </button>
            <button type="button" @click="cancelEdit" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useSportStore } from '@/stores/sportStore';
import { useUserStore } from '@/stores/userStore';
import { Field, Form, ErrorMessage, defineRule, configure } from 'vee-validate';
import * as yup from 'yup';

defineRule('required', value => {
  return value !== null && value !== '' ? true : 'This field is required';
});

defineRule('positive', value => {
  return value >= 0 ? true : 'Value must be a non-negative number';
});

configure({
  generateMessage: context => {
    const messages = {
      required: `The field ${context.field} is required.`,
      positive: `${context.field} must be a positive number.`,
    };
    return messages[context.rule.name] || 'Invalid field';
  },
});

interface Sport {
  id: number;
  name: string;
  gold: number;
  silver: number;
  bronze: number;
}

export default defineComponent({
  name: 'SportList',
  components: { Field, Form, ErrorMessage },
  props: {
    noc: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const sportStore = useSportStore();
    const userStore = useUserStore();

    const currentPage = ref(1);
    const itemsPerPage = 5;

    const totalPages = computed(() =>
      Math.ceil(sportStore.disciplines.length / itemsPerPage)
    );

    const paginatedDisciplines = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return sportStore.disciplines.slice(start, start + itemsPerPage);
    });

    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
    };

    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value--;
    };

    const editingSport = ref<Sport | null>(null);
    const editingGold = ref(0);
    const editingSilver = ref(0);
    const editingBronze = ref(0);

    const startEdit = (sport: Sport) => {
      editingSport.value = sport;
      editingGold.value = sport.gold;
      editingSilver.value = sport.silver;
      editingBronze.value = sport.bronze;
    };

    const saveEdit = async () => {
      if (editingSport.value) {
        await sportStore.updateMedals(
          props.noc,
          editingSport.value.id,
          {
            gold: editingGold.value,
            silver: editingSilver.value,
            bronze: editingBronze.value,
          }
        );
        cancelEdit();
      }
    };

    const cancelEdit = () => {
      editingSport.value = null;
      editingGold.value = 0;
      editingSilver.value = 0;
      editingBronze.value = 0;
    };

    onMounted(async () => {
      await sportStore.fetchDisciplines(props.noc);
    });

    return {
      currentPage,
      totalPages,
      paginatedDisciplines,
      nextPage,
      prevPage,
      editingSport,
      editingGold,
      editingSilver,
      editingBronze,
      startEdit,
      saveEdit,
      cancelEdit,
      isAdmin: computed(() => userStore.isAdmin),
    };
  },
});
</script>


<style scoped>
.sport-list-container {
  max-width: 800px;
  margin: 0 auto;
}

.input-field {
  border: 1px solid #ccc;
  padding: 8px;
  width: 100px;
  margin-top: 5px;
  border-radius: 4px;
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
}

.modal-actions button {
  padding: 10px 20px;
}
</style>
