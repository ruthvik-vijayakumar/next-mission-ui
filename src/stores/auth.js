import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import jwtDecode from 'jwt-decode'
import api from '../utils/axios'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)

  const isAuthenticated = computed(() => !!token.value)
  const isOnboarded = computed(() => user.value?.onboarded || false)

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login/', { email, password })
      console.log(response.data)
      const { access: newToken } = response.data
      
      token.value = newToken
      user.value = jwtDecode(newToken)
      
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(userData))
      
      return true
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      const { token: newToken, user: newUser } = response.data
      
      token.value = newToken
      user.value = newUser
      
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      
      return true
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData)
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(response.data))
      return true
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    }
  }

  const completeOnboarding = async (onboardingData) => {
    try {
      const response = await api.post('/users/onboarding', onboardingData)
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(response.data))
      return true
    } catch (error) {
      console.error('Onboarding error:', error)
      throw error
    }
  }

  const linkedInLogin = async () => {
    try {
      const response = await api.get('/auth/linkedin')
      window.location.href = response.data.url
    } catch (error) {
      console.error('LinkedIn login error:', error)
      throw error
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    isOnboarded,
    login,
    register,
    logout,
    updateProfile,
    completeOnboarding,
    linkedInLogin
  }
}) 