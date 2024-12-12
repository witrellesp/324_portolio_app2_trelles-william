<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BookService from '../services/BookService'
const router = useRouter()
const route = useRoute()

onMounted(() => {
  deleteBook()
})
//Suppresion du livre
async function deleteBook() {
  try {
    const response = await BookService.deleteBook(route.params.id)
    if (response.status === 200) {
      router.push('/home') // Redirection vers la page d'accueil
    } else {
      throw new Error('Erreur lors de la suppression du livre.')
    }
  } catch (error) {
    console.error(error)
    alert('Erreur lors de la suppression du livre. Veuillez réessayer plus tard.')
  }
}
</script>
