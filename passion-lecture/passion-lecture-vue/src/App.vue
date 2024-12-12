<script setup>
import { RouterView } from 'vue-router'
import TheHeader from './components/TheHeader.vue'
import TheFooter from './components/TheFooter.vue'
</script>

<template>
  <TheHeader />
  <RouterView />
  <TheFooter />
  <!-- espace résérvé pour le contenue du composant "view", sera replacer par le composant de la route chargée -->
</template>
<!-- composant de la library vue-router, crée un lien vers une route spécifique -->

<!-- font size pour toute l'app -->
<style>
h1 {
  font-size: 40px;
}

h2 {
  font-size: 26px;
}

#layout {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
  background-color: #1c333a;
  color: white; /* Ensure text is visible on the dark background */
  font-family: Avenir, Arial, Helvetica, sans-serif;
  margin: 0;
  padding: 0;
}
</style>
