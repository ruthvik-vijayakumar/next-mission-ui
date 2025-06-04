import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/utils/axios'
import jwtDecode from 'jwt-decode'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token'))
  const user = ref(null)
  const documentData = ref(null)
  const onboarded = ref(null)


  const isAuthenticated = computed(() => !!token.value)

  const setToken = (newToken) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
      user.value = jwtDecode(newToken)
    } else {
      localStorage.removeItem('token')
      user.value = null
    }
  }

  const login = async (email, password) => {
    try {
      const response = await authApi.post('login/', { email, password })
      console.log(response.data)
      const { access: newToken, onboarded: isOnboarded } = response.data
      onboarded.value = isOnboarded
      setToken(newToken)
      return true
    } catch (error) {
      throw error.response?.data || error
    }
  }

  const register = async (userData) => {
    try {
      const response = await authApi.post('register/', userData)
      console.log(response.data)
      user.value = response.data
      return true
    } catch (error) {
      throw error.response?.data || error
    }
  }

  const logout = async () => {
    try {
      await authApi.post('logout/')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setToken(null)
    }
  }

  const getProfile = async () => {
    try {
      const response = await authApi.get('profile/')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await authApi.put('profile/', profileData)
      user.value = response.data
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  const completeOnboarding = async (onboardingData) => {
    try {
      const response = await authApi.post('onboarding/', onboardingData)
      user.value = { ...user.value, onboarded: true }
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  const linkedInLogin = async () => {
    try {
      const response = await authApi.get('/auth/linkedin')
      window.location.href = response.data.url
    } catch (error) {
      console.error('LinkedIn login error:', error)
      throw error
    }
  }

  const uploadDocument = async (file, documentType) => {
    try {
      const formData = new FormData()
      formData.append('file_obj', file)
      formData.append('user_id', user.value?.id || user.value.user_id)
      formData.append('document_type', documentType)

      const response = await authApi.post('onboard/doc/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return response.data
    } catch (error) {
      console.error('Document upload error:', error)
      throw error
    }
  }

  const setDocumentData = (data) => {
    documentData.value = data
  }

  const clearDocumentData = () => {
    documentData.value = null
  }

  return {
    token,
    user,
    isAuthenticated,
    onboarded,
    login,
    register,
    logout,
    getProfile,
    updateProfile,
    completeOnboarding,
    linkedInLogin,
    uploadDocument,
    documentData,
    setDocumentData,
    clearDocumentData
  }
}, 
{
  persist: true,
}
) 