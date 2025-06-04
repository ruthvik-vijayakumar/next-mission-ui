import { defineStore } from 'pinia'
import { ref } from 'vue'
import {api} from '@/utils/axios'

export const useEventsStore = defineStore('events', () => {
  const events = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchEvents() {
    loading.value = true
    error.value = null
    // '/jobs/search'
    try {
      const response = await api.get('events/all')
      console.log("response", response)
      events.value = response.data
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function searchEvents() {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('events/search')
      if (!response.ok) {
        throw new Error('Failed to search events')
      }
      const data = await response.json()
      events.value = data
      return data
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    events,
    loading,
    error,
    fetchEvents,
    searchEvents
  }
}) 