<template>
    <div class="about-view flex justify-center items-center p-4">
      <div class="table-container w-1/3">
        <h2 class="text-center text-xl font-bold mb-4">About Us</h2>
        <table class="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th class="border-b px-4 py-2">Name</th>
              <th class="border-b px-4 py-2">StudentId</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border-b px-4 py-2">Liao Zhenghua</td>
              <td class="border-b px-4 py-2">20222092</td>
            </tr>
            <tr>
              <td class="border-b px-4 py-2">Chen Hao</td>
              <td class="border-b px-4 py-2">20222090</td>
            </tr>
            <tr>
              <td class="border-b px-4 py-2">He Haonan</td>
              <td class="border-b px-4 py-2">20222094</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'TeamMember',
  });
  </script>
  
  <style scoped>
  .about-view {
    @apply max-w-full mx-auto p-4;
  }
  
  .table-container {
    @apply w-1/3;
  }
  
  table {
    @apply w-full border-separate border-spacing-0;
  }
  
  th, td {
    @apply text-center border px-4 py-2;
  }
  
  th {
    @apply bg-gray-100 font-semibold;
  }
  </style>
  