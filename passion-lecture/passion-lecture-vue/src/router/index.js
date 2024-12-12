import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/book-list', // chemin de la route
      name: 'book-list', // nom de la route
      component: () => import('../views/BookList.vue')
    },
    {
      path: '/',
      name: 'account',
      component: () => import('../views/AccountView.vue')
    },
    {
      path: '/addbook',
      name: 'add-book',
      component: () => import('../views/AddBook.vue')
    },
    {
      path: '/book/:id',
      name: 'book-details',
      props: true,
      component: () => import('../views/BookDetails.vue')
    },
    {
      path: '/book/:id',
      name: 'edit-book',
      component: () => import('../views/EditBook.vue')
    },

    {
      path: '/delete-book/:id',
      name: 'delete-book',
      component: () => import('../views/DropBook.vue')
    },
    {
      path: '/',
      name: 'account',
      component: () => import('../views/AccountView.vue')
    }
  ]
})

export default router
