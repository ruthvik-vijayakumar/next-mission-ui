//veteran/biodata/pdf/

import { defineStore } from 'pinia'
import { ref } from 'vue'
import {api} from '@/utils/axios'

export const useResumeStore = defineStore('resume', () => {
  const resume = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchBiodata() {
    loading.value = true
    error.value = null
    // '/jobs/search'
    try {
      const response = await api.post('bio/generate')
    //   console.log("response", response)
      resume.value = response.data
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchResumePdf() {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('bio/download', null, {
        responseType: 'blob'
      })
      return response.data
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    resume,
    loading,
    error,
    fetchBiodata,
    fetchResumePdf
  }
}) 