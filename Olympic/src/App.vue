<template>
  <div id="app">
    <Navigation :menuItems="menuItems" />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navigation from '@/components/Navigation.vue';
import axios from 'axios';
axios.defaults.withCredentials = true;

export default defineComponent({
  components: { Navigation },
  data() {
    return {
      menuItems: [
        { name: 'Home', link: '/' },
        { name: 'About Us', link: '/team' },
        { name: 'Contact', link: '/contact' },
      ],
    };
  },
});
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
