<script setup>
import { ref, onMounted } from 'vue'
import BookService from '@/services/BookService'

// Définir les références réactives
const book = ref(null)
const rates = ref([])
const comments = ref([])
const category = ref(null)
const author = ref(null)
const user = ref(null)
const averageRating = ref(0)

// Obtenir les propriétés du composant
const props = defineProps({
  id: {
    required: true,
    type: String
  }
})

// Fonction pour calculer la moyenne des évaluations
async function calculateAverageRating(rates) {
  if (!Array.isArray(rates) || rates.length === 0) {
    return '0.00'
  }

  const sum = rates.reduce((acc, rate) => {
    if (typeof rate.rating !== 'number') {
      throw new Error('Each rate must have a numeric rating property.')
    }
    return acc + rate.rating
  }, 0)

  return (sum / rates.length).toFixed(2)
}

// Charger les données lorsque le composant est monté
onMounted(async () => {
  try {
    // Obtenir les informations du livre
    const infoBook = await BookService.getBook(props.id)
    book.value = infoBook.data.data
    console.log('Book:', book.value)

    // Obtenir les informations de la catégorie
    const infoCategory = await BookService.getCategory(book.value.categoryId)
    category.value = infoCategory.data.data
    console.log('Category:', category.value)

    // Obtenir les informations de l'auteur
    const infoAuthor = await BookService.getWriter(book.value.writerId)
    author.value = infoAuthor.data.data
    console.log('Author:', author.value)

    // Obtenir les informations de l'utilisateur
    const infoUser = await BookService.getUser(book.value.userId)
    user.value = infoUser.data.data
    console.log('User:', user.value)

    // Obtenir les évaluations du livre
    const infoRates = await BookService.getBookRates(props.id)
    rates.value = infoRates.data.data
    console.log('Rates:', rates.value)

    // Obtenir les commentaires du livre
    const infoComments = await BookService.getBookComments(props.id)
    comments.value = infoComments.data.data
    console.log('Comments:', comments.value)

    // Calculer la moyenne des évaluations
    averageRating.value = await calculateAverageRating(rates.value)
    console.log('Average Rating:', averageRating.value)
  } catch (error) {
    console.error(error)
  }
})

// Fonction pour retourner à la page précédente
function goBack() {
  window.history.back()
}
</script>

<template>
  <div class="book-card" v-if="book">
    <h2>{{ book.title }}</h2>
    <img :src="book.book_cover" alt="Couverture du livre" />
    <p>Résumé: {{ book.summary }}</p>
    <h3>Catégorie: {{ category ? category.name : 'Chargement...' }}</h3>
    <p>
      Auteur: {{ author ? author.firstName : 'Chargement...' }}
      {{ author ? author.lastName : 'Chargement...' }}
    </p>
    <p>Éditeur: {{ book.publisher }}</p>
    <p>Pages: {{ book.number_of_pages }}</p>
    <p>Posté par: {{ user ? user.nickName : 'Chargement...' }}</p>
    <h3>Évaluations:</h3>
    <p>Moyenne des évaluations: {{ averageRating }}</p>
    <ul>
      <li v-for="rate in rates" :key="rate.id">
        Utilisateur {{ rate.userId }}: {{ rate.rating }} étoiles
      </li>
    </ul>
    <h3>Commentaires:</h3>
    <ul v-if="comments.length > 0">
      <li v-for="comment in comments" :key="comment.id">Commentaire: {{ comment.text }}</li>
    </ul>
    <p v-else>Aucun commentaire pour ce livre.</p>
    <RouterLink class="button-link" :to="{ name: 'edit-book', params: { BookId: book.id } }">
      Modifier ce livre
    </RouterLink>
    <RouterLink class="button-link" :to="{ name: 'delete-book', params: { BookId: book.id } }">
      Supprimer
    </RouterLink>
    <button class="button-link" @click="goBack">Retour</button>
  </div>
</template>

<style scoped>
.book-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.book-card h2 {
  margin-top: 0px;
  font-size: 24px;
  color: #007bff;
  margin-bottom: 10px;
}

.book-card img {
  max-width: 219px; /* Adjust the maximum width as needed */
  height: auto;
  border-radius: 8px;
  margin-bottom: 10px;
}

.book-card p {
  margin-bottom: 8px; /* Reduced margin-bottom */
  margin-top: 8px; /* Reduced margin-top */
}

.button-link {
  display: inline-block;
  padding: 10px 15px;
  background-color: #007bff;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 14px;
  margin-top: 10px;
}

.button-link:hover {
  background-color: #0056b3;
}

.book-card ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.book-card ul li {
  margin-bottom: 5px;
}
</style>
