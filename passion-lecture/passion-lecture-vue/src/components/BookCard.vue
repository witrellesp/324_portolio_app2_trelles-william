<script setup>
defineProps({
  book: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <RouterLink class="book-link" :to="{ name: 'book-details', params: { id: book.id } }">
    <div class="book-card">
      <h2>{{ book.title }}</h2>
      <img :src="book.book_cover" alt="Book Cover" v-if="book.book_cover" />
    </div>
  </RouterLink>
</template>

<style scoped>
.book-card {
  padding: 10px;
  width: 200px; /* Adjusted width for smaller book cards */
  cursor: pointer;
  border: 1px solid #fff; /* White border */
  color: white;
  background-color: #39495c;
  border-radius: 8px; /* Rounded corners */
  margin-bottom: 15px; /* Increased margin */
  margin-top: 5px;
  margin-left: 1px;
  margin-right: 20px; /* Margin between each book card */
}

.book-card:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2);
}

.book-link {
  color: #39495c;
  text-decoration: none;
}

.book-card h2 {
  font-size: 14px; /* Adjusted font size for the book title */
  margin-bottom: 5px;
}

.book-card img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}
</style>
