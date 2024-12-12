<script setup>
import { ref } from 'vue'
import BookService from '../services/BookService.js'
import { useRouter } from 'vue-router'
import { isAuthenticated } from '../auth.js' // Importar el valor reactivo

const router = useRouter()
const users = ref(null)
const searchQuery = ref('')
const errorMessage = ref('')

const nickName = ref('')
const password = ref('')
const loginError = ref('')

const login = async () => {
  try {
    const response = await BookService.login({
      nickName: nickName.value,
      password: password.value
    })

    if (response.data.token) {
      localStorage.setItem('jwt', response.data.token)
      loginError.value = ''
      isAuthenticated.value = true
      router.push('/home')
      console.log('Login successful:', response.data.data)
    } else {
      loginError.value = 'Invalid nickname or password'
    }
  } catch (error) {
    console.log(error)
    loginError.value = 'An error occurred during login'
  }
}

const logout = () => {
  localStorage.removeItem('jwt')
  isAuthenticated.value = false
  nickName.value = ''
  password.value = ''
  users.value = null
  searchQuery.value = ''
  errorMessage.value = ''
  loginError.value = ''
}
</script>

<template>
  <div class="container">
    <div class="account">
      <h2>My Account</h2>
      <div v-if="isAuthenticated">
        <button @click="logout">Logout</button>
      </div>

      <div v-else>
        <form @submit.prevent="login">
          <label for="nickName">Nickname</label>
          <input
            type="text"
            v-model="nickName"
            name="nickName"
            id="nickName"
            placeholder="Enter nickname"
            required
          />
          <label for="password">Password</label>
          <input
            type="password"
            v-model="password"
            name="password"
            id="password"
            placeholder="Enter password"
            required
          />
          <input type="submit" value="Login" />
        </form>
      </div>
    </div>

    <div v-if="loginError" class="error">{{ loginError }}</div>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.account {
  margin: 0 auto;
  padding: 20px;
  margin-top: 235px;
  margin-bottom: 295px;
  max-width: 400px;
  width: 350px;
  background: rgb(167, 254, 255);
  background: linear-gradient(203deg, rgba(167, 254, 255, 1) 0%, rgba(110, 255, 170, 1) 100%);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1; /* Ensure the account div stays above the background */
}

.account h2 {
  margin-top: 5px;
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  color: rgb(0, 86, 126);
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
}

label {
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  color: rgb(0, 86, 126);
}

input[type='text'],
input[type='password'],
input[type='submit'] {
  width: 80%;
  max-width: 80%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  border-radius: 10px;
}

input[type='submit'] {
  background: #28a745;
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  color: white;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.3s ease;
}

input[type='submit']:hover {
  background: rgb(0, 143, 0);
}

button {
  padding: 10px 15px;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 84px;
  margin-bottom: 84px;
  transition: background 0.3s ease;
  font-family: 'Arial', sans-serif;
  font-weight: bold;
}

button:hover {
  background: #0063cc;
}

.error {
  position: absolute;
  bottom: 250px;
  width: 100%;
  color: red;
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  text-align: center;
  z-index: 2; /* Ensure the error message stays above other content */
}

label {
  margin-bottom: -12px;
}
</style>
