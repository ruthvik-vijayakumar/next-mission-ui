import { defineStore } from 'pinia'
import { ref } from 'vue'
import {api} from '@/utils/axios'

export const useJobsStore = defineStore('jobs', () => {
  const jobs = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchJobs() {
    loading.value = true
    error.value = null
    // '/jobs/search'
    try {
      const response = await api.get('jobs/all')
      console.log("response", response)
      jobs.value = response.data
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function searchJobs() {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('jobs/search')
      if (!response.ok) {
        throw new Error('Failed to search jobs')
      }
      const data = await response.json()
      jobs.value = data
      return data
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    jobs,
    loading,
    error,
    fetchJobs,
    searchJobs
  }
}) 