import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3901/api',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8'
  }
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const uploadImage = async (imageFile) => {
  const formData = new FormData()
  formData.append('image', imageFile)

  try {
    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    console.log('Image correctement chargée:', response.data)
    return response.data.url
  } catch (error) {
    console.error("Erreur lors du chargement de l'image:", error)
    throw error
  }
}

export { uploadImage }

export default {
  // get tous les books
  getBooks() {
    return apiClient.get('/books')
  },
  getCategorie(id) {
    return apiClient.get('/categories/' + id)
  },
  getBook(id) {
    return apiClient.get('/books/' + id, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  getBookRates(id) {
    return apiClient.get(`/books/${id}/rates`)
  },
  getBookComments(id) {
    return apiClient.get(`/books/${id}/comments`)
  },
  insertCover(image) {
    const formData = new FormData()
    formData.append('image', image)

    return apiClient.post('/books/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  createBook(newBook) {
    return apiClient.post('/books/', newBook, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  editBook(id, newBook) {
    return apiClient.put('/books/' + id, newBook, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  deleteBook(id) {
    return apiClient.delete('/books/' + id)
  },
  getCategories() {
    return apiClient.get('/categories')
  },
  getCategory(id) {
    return apiClient.get('/categories/' + id)
  },
  getCategoryByName(name) {
    return apiClient.get(`/categories/name/${name}`)
  },
  getWriters() {
    return apiClient.get('/authors')
  },
  getWriter(id) {
    return apiClient.get('/authors/' + id)
  },
  getWriterByFirstname(firstname) {
    return apiClient.get(`/authors/firstname/${firstname}`)
  },
  getUser(id) {
    return apiClient.get('/users/' + id)
  },
  login(credentials) {
    return apiClient.post('/login', credentials)
  }
}
