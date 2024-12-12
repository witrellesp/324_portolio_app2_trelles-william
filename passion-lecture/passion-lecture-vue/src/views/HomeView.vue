<script setup>
import BookCard from '@/components/BookCard.vue'
import BookService from '@/services/BookService'
import { ref, onMounted } from 'vue'

const books = ref(null)
onMounted(() => {
  BookService.getBooks()
    .then((response) => {
      // Le backend nous retourne un objet contenant 2 entrées :
      // - msg qde confirmation
      // - data qui contient l'ensemble des livres
      books.value = response.data.data.slice(0, 5) // Show only the first 5 books
    })
    .catch((error) => {
      console.log(error)
    })
})
</script>

<template>
  <h3 class="title">The bestsellers:</h3>
  <div class="home">
    <div class="books-container">
      <BookCard v-for="book in books" :key="book.id" :book="book" />
    </div>
  </div>
  <p>
    Cette application a été réalisée dans le cadre d'un apprentissage durant les heures de "projet"
    par les élèves de l'ETML. L'objectif de ce site est de permettre de lire les informations des
    différents livres, ainsi que d'en ajouter, éditer ou supprimer. Ce site web pour but final de
    permettre de partager sa passion pour la lecture.
  </p>
</template>

<style scoped>
.title {
  margin-top: 40px;
  margin-bottom: 35px;
  margin-left: 30px; /* Add margin-top to the title */
}

.home {
  display: flex;
  align-items: center;
  justify-content: center; /* Center the book cards horizontally */
  overflow-x: hidden; /* Hide horizontal overflow */
  margin-top: 200px;
  margin-bottom: 200px;
}

.books-container {
  max-width: 100%;
  overflow-x: auto; /* Enable horizontal scrolling */
  display: flex;
  flex-wrap: wrap; /* Allow the books to wrap onto new lines */
  justify-content: center; /* Center the books horizontally */
}

p {
  text-align: center; /* Center the text horizontally */
  margin: 20px auto; /* Center the <p> element itself */
  width: 80%; /* Optional: control the width of the <p> for better appearance */
}
</style>
