<template>
  <div v-if="isAdmin" class="add-country-container">
    <h1 class="text-xl font-bold mb-4 text-center">Add Country</h1>
    <Form :validation-schema="schema" @submit="handleAddCountry" v-slot="{ errors }">
      <div class="form-group">
        <label for="noc" class="block mb-2">NOC Code:</label>
        <Field type="text" id="noc" name="noc" v-model="newCountry.noc" class="input-field" />
        <ErrorMessage name="noc" class="tooltip" />
      </div>
      <div class="form-group">
        <label for="nocSlug" class="block mb-2">NOC Slug:</label>
        <Field type="text" id="nocSlug" name="nocSlug" v-model="newCountry.nocSlug" class="input-field" />
        <ErrorMessage name="nocSlug" class="tooltip" />
      </div>
      <div class="form-group">
        <label for="enDescription" class="block mb-2">Short Description:</label>
        <Field
          type="text"
          id="enDescription"
          name="enDescription"
          v-model="newCountry.enDescription"
          class="input-field"
        />
        <ErrorMessage name="enDescription" class="tooltip" />
      </div>
      <div class="form-group">
        <label for="enLongDescription" class="block mb-2">Long Description:</label>
        <Field
          type="text"
          id="enLongDescription"
          name="enLongDescription"
          v-model="newCountry.enLongDescription"
          class="input-field"
        />
        <ErrorMessage name="enLongDescription" class="tooltip" />
      </div>
      <div class="form-group">
        <label for="rank" class="block mb-2">Rank:</label>
        <Field type="number" id="rank" name="rank" v-model="newCountry.rank" class="input-field" />
        <ErrorMessage name="rank" class="tooltip" />
      </div>
      <div class="form-group">
        <label for="sortRank" class="block mb-2">Sort Rank:</label>
        <Field type="number" id="sortRank" name="sortRank" v-model="newCountry.sortRank" class="input-field" />
        <ErrorMessage name="sortRank" class="tooltip" />
      </div>
      <div class="form-group">
        <label for="rankTotal" class="block mb-2">Total Rank:</label>
        <Field type="number" id="rankTotal" name="rankTotal" v-model="newCountry.rankTotal" class="input-field" />
        <ErrorMessage name="rankTotal" class="tooltip" />
      </div>
      <div class="form-group">
        <label for="sortTotalRank" class="block mb-2">Sort Total Rank:</label>
        <Field
          type="number"
          id="sortTotalRank"
          name="sortTotalRank"
          v-model="newCountry.sortTotalRank"
          class="input-field"
        />
        <ErrorMessage name="sortTotalRank" class="tooltip" />
      </div>
      <div class="form-group">
        <label for="gold" class="block mb-2">Gold Medals:</label>
        <Field type="number" id="gold" name="gold" v-model="newCountry.gold" class="input-field" />
        <ErrorMessage name="gold" class="tooltip" />
      </div>
      <div class="form-group">
        <label for="silver" class="block mb-2">Silver Medals:</label>
        <Field type="number" id="silver" name="silver" v-model="newCountry.silver" class="input-field" />
        <ErrorMessage name="silver" class="tooltip" />
      </div>
      <div class="form-group">
        <label for="bronze" class="block mb-2">Bronze Medals:</label>
        <Field type="number" id="bronze" name="bronze" v-model="newCountry.bronze" class="input-field" />
        <ErrorMessage name="bronze" class="tooltip" />
      </div>
      <div class="form-group">
        <label for="total" class="block mb-2">Total Medals:</label>
        <Field type="number" id="total" name="total" v-model="newCountry.total" class="input-field" />
        <ErrorMessage name="total" class="tooltip" />
      </div>
      <div class="form-group">
        <label for="flagUrl" class="block mb-2">Flag URL:</label>
        <Field type="text" id="flagUrl" name="flagUrl" v-model="newCountry.flagUrl" class="input-field" />
        <ErrorMessage name="flagUrl" class="tooltip" />
      </div>
      <div class="form-actions flex gap-2 justify-center mt-4">
        <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Add Country
        </button>
        <button type="button" @click="cancelAdd" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Cancel
        </button>
      </div>
    </Form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useCountryStore } from "@/stores/countryStore";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "AddCountry",
  components: { Form, Field, ErrorMessage },
  setup() {
    const router = useRouter();
    const userStore = useUserStore();

    const isAdmin = computed(() => userStore.isAdmin);

    const newCountry = ref({
      noc: "",
      nocSlug: "",
      rank: 0,
      sortRank: 0,
      rankTotal: 0,
      sortTotalRank: 0,
      gold: 0,
      silver: 0,
      bronze: 0,
      total: 0,
      enDescription: "",
      enLongDescription: "",
      flagUrl: "",
    });

    const schema = yup.object({
      noc: yup.string().required("NOC is required"),
      nocSlug: yup.string().required("NOC Slug is required"),
      enDescription: yup.string().required("Short description is required"),
      enLongDescription: yup.string().required("Long description is required"),
      rank: yup.number().required("Rank is required").min(0, "Rank must be non-negative"),
      sortRank: yup.number().required("Sort Rank is required"),
      rankTotal: yup.number().required("Total Rank is required"),
      sortTotalRank: yup.number().required("Sort Total Rank is required"),
      gold: yup.number().required("Gold is required").min(0, "Gold must be non-negative"),
      silver: yup.number().required("Silver is required").min(0, "Silver must be non-negative"),
      bronze: yup.number().required("Bronze is required").min(0, "Bronze must be non-negative"),
      total: yup.number().required("Total is required").min(0, "Total must be non-negative"),
      flagUrl: yup.string().required("Flag URL is required"),
    });

    onMounted(() => {
      if (!isAdmin.value) {
        router.push({ name: "404-error" });
      }
    });

    const handleAddCountry = async () => {
      try {
        const countryStore = useCountryStore();
        await countryStore.addCountry(newCountry.value);
        alert("Country added successfully!");
        router.push("/"); // Redirect to the main page
      } catch (error) {
        console.error("Failed to add country:", error);
      }
    };

    const cancelAdd = () => {
      router.push("/");
    };

    return {
      isAdmin,
      newCountry,
      schema,
      handleAddCountry,
      cancelAdd,
    };
  },
});
</script>

<style scoped>
.add-country-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.input-field {
  border: 1px solid #ccc;
  padding: 8px;
  width: 100%;
  border-radius: 4px;
}

.tooltip {
  background-color: #f8d7da;
  color: #721c24;
  padding: 5px;
  border-radius: 4px;
  font-size: 12px;
  margin-top: 4px;
}
</style>
