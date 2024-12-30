<template>
  <div class="not-found">
    <h1>404 - Page Not Found</h1>
    <p>Sorry, the page you are looking for does not exist.</p>
    <router-link to="/">Return to Home</router-link>
  </div>
</template>

<script>
export default {
  name: "NotFoundView"
};
</script>

<style scoped>
.not-found {
  text-align: center;
  margin-top: 50px;
}
.not-found h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}
.not-found p {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}
.not-found a {
  color: #007BFF;
  text-decoration: none;
}
.not-found a:hover {
  text-decoration: underline;
}
</style>
