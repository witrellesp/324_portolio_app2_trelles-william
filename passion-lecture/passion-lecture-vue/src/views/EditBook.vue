<template>
  <main>
    <div class="edit">
      <h2 class="title">Edit a book</h2>
      <form @submit.prevent="editBook" enctype="multipart/form-data">
        <input v-model="newBook.title" placeholder="Title" />
        <input v-model="newBook.number_of_pages" type="number" placeholder="Number of Pages" />
        <input v-model="newBook.publisher" placeholder="Publisher" />
        <input
          v-model="newBook.date_of_publication"
          type="date"
          placeholder="Year of Publication"
        />
        <textarea v-model="newBook.excerpt" placeholder="Excerpt"></textarea>
        <textarea v-model="newBook.summary" placeholder="Summary"></textarea>
        <select v-model="newBook.writerId" required>
          <option disabled value="">Select an author</option>
          <option v-for="author in authors" :key="author.id" :value="author.id">
            {{ author.firstName }} {{ author.lastName }}
          </option>
        </select>
        <select v-model="newBook.categoryId" required>
          <option disabled value="">Select a category</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
        <input type="file" @change="handleFileUpload" name="book_cover" />
        <button type="submit">Modifier</button>
      </form>
      <button class="back-button" @click="goBack">Retour</button>
    </div>
  </main>
</template>

<script setup>
defineProps({
  BookId: {
    type: String,
    required: true
  }
})
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BookService from '../services/BookService.js'

const route = useRoute()
const router = useRouter()
const newBook = ref({})
const authors = ref([])
const categories = ref([])

async function loadAuthors() {
  try {
    const response = await BookService.getWriters()
    authors.value = response.data.data
  } catch (error) {
    console.error('Erreur lors du chargement des auteurs:', error)
  }
}

async function loadCategories() {
  try {
    const response = await BookService.getCategories()
    categories.value = response.data.data
  } catch (error) {
    console.error('Erreur lors du chargement des catégories:', error)
  }
}

onMounted(async () => {
  try {
    await loadAuthors()
    await loadCategories()
    const response = await BookService.getBook(route.params.id)
    newBook.value = response.data.data
  } catch (error) {
    console.log(error)
  }
})

function handleFileUpload(event) {
  newBook.value.book_cover = event.target.files[0]
}

async function editBook() {
  if (
    newBook.value.title &&
    newBook.value.number_of_pages &&
    newBook.value.publisher &&
    newBook.value.date_of_publication &&
    newBook.value.excerpt &&
    newBook.value.summary &&
    newBook.value.writerId &&
    newBook.value.categoryId
  ) {
    try {
      const token = localStorage.getItem('jwt')
      if (!token) {
        alert('Token not found. Please log in again.')
        return
      }

      let decodedToken
      try {
        decodedToken = JSON.parse(atob(token.split('.')[1]))
      } catch (e) {
        console.error('Error decoding token:', e)
        alert('Invalid token. Please log in again.')
        return
      }

      const userId = decodedToken.userId
      if (!userId) {
        alert('User ID not found in token. Please log in again.')
        return
      }

      const formData = new FormData()
      formData.append('title', newBook.value.title)
      formData.append('number_of_pages', newBook.value.number_of_pages)
      formData.append('publisher', newBook.value.publisher)
      formData.append('date_of_publication', newBook.value.date_of_publication)
      formData.append('excerpt', newBook.value.excerpt)
      formData.append('summary', newBook.value.summary)
      if (newBook.value.book_cover) {
        formData.append('book_cover', newBook.value.book_cover)
      } else {
        formData.append('book_cover', '/toto/')
      }
      formData.append('userId', userId)
      formData.append('writerId', newBook.value.writerId)
      formData.append('categoryId', newBook.value.categoryId)

      const response = await BookService.editBook(route.params.id, formData)
      console.log('editBook response:', response.data)

      newBook.value = {
        title: '',
        number_of_pages: '',
        publisher: '',
        date_of_publication: '',
        excerpt: '',
        summary: '',
        book_cover: null,
        writerId: '',
        categoryId: ''
      }
      router.push('/home')
    } catch (error) {
      console.log(
        'Erreur lors du update du livre:',
        error.response ? error.response.data : error.message
      )
    }
  } else {
    alert('Veuillez remplir tous les champs.')
  }
}

function goBack() {
  window.history.back()
}
</script>

<style scoped>
.title {
  margin-top: 40px;
  margin-bottom: 35px;
  margin-left: 30px; /* Add margin-top to the title */
}
.edit {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Center the book cards horizontally */
  overflow-x: hidden; /* Hide horizontal overflow */
  margin-top: 50px; /* Adjust margin as needed */
}
form {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.back-button {
  margin-top: 2%; /* Ensure button is at the bottom */
  margin-bottom: 5%;
}
</style>
