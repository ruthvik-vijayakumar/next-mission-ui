import axios from 'axios'

// Auth axios instance
export const authApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/auth/`,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Main axios instance for other services
export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1/`,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor to both instances
const addAuthHeader = (config) => {
  const token = localStorage.getItem('token')
  console.log(token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

authApi.interceptors.request.use(addAuthHeader)
api.interceptors.request.use(addAuthHeader)

// Add response interceptor to handle errors
const handleResponseError = (error) => {
  console.log(error)
  if (error.response?.status === 401) {
    // Handle unauthorized access
    localStorage.removeItem('token') 
    // window.location.href = '/auth'
  }
  return Promise.reject(error)
}

authApi.interceptors.response.use(response => response, handleResponseError)
api.interceptors.response.use(response => response, handleResponseError)

export default api 