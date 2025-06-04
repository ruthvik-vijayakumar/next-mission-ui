import { defineStore } from 'pinia'
import { ref } from 'vue'
import {api} from '@/utils/axios'

export const useMentorsStore = defineStore('mentors', () => {
  const mentors = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchMentors() {
    loading.value = true
    error.value = null
    // '/jobs/search'
    try {
      const response = await api.get('mentors/all')
      console.log("response", response)
      mentors.value = response.data
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function searchMentors() {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('mentors/search')
      if (!response.ok) {
        throw new Error('Failed to search mentors')
      }
      const data = await response.json()
      mentors.value = data
      return data
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    mentors,
    loading,
    error,
    fetchMentors,
    searchMentors
  }
}) 