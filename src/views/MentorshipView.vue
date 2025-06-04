<template>
  <div class="min-h-screen bg-gray-50">

    <div class="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm flex items-center h-14 px-2">
      <button @click="$router.back()"
        class="mr-1 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-military-blue">

        <svg class="h-6 w-6 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 12H4M4 12L10 18M4 12L10 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>

      </button>
      <h1 class="flex-1 text-base font-semibold text-gray-900">Mentor Search</h1>
      <span class="w-8"></span> <!-- Spacer to balance the back button -->
    </div>

          <!-- Top Tabs -->
          <div class="bg-white sticky top-0 z-20">
        <div class="max-w-2xl mx-auto flex items-center px-4 py-2">
          <nav class="flex-1 flex space-x-2 overflow-x-auto">
            <button
              class="px-4 py-2 border-b-2 border-military-blue text-military-blue font-semibold focus:outline-none">For
              you</button>
            <button
              class="px-4 py-2 border-b-2 border-transparent text-gray-500 hover:text-military-blue hover:border-military-blue transition focus:outline-none relative">Liked<span
                class="ml-1 text-xs font-bold bg-gray-200 text-gray-700 rounded-full px-1.5">25</span></button>
            <button
              class="px-4 py-2 border-b-2 border-transparent text-gray-500 hover:text-military-blue hover:border-military-blue transition focus:outline-none relative">Applied<span
                class="ml-1 text-xs font-bold bg-gray-200 text-gray-700 rounded-full px-1.5">4</span></button>
          </nav>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="bg-white sticky top-14 z-10 border-b border-gray-100">
        <div class="flex items-stretch px-4 py-2 gap-3">
          <!-- Filters Button -->
          <button @click="showFilter = !showFilter"
            class="inline-flex flex-1 items-center px-4 py-2 rounded-xl bg-white text-gray-900 shadow font-medium border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-military-blue relative">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 10h18M6 6h12M9 14h6M12 18h0" />
            </svg>
            <div class="flex-1 text-left">Filters</div>
            <span
              class="ml-2 inline-flex items-center justify-center text-xs font-bold bg-black text-white rounded-full px-2 h-5">10</span>
          </button>
          <!-- Recommended Button -->
          <button
            class="inline-flex flex-1 items-center px-4 py-2 rounded-xl bg-white text-gray-900 shadow font-medium border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-military-blue">
            <div class="flex-1 text-left">Recommended</div>
            <svg class="h-4 w-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->






      <!-- Mentor Grid -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="mentor in mentorsStore.mentors" :key="mentor.profile_url" class=" shadow rounded-lg">
          <div class="p-6">
            <div class="flex items-center">
              <div>
                <h3 class="text-lg font-medium text-gray-900">{{ mentor.name }}</h3>
                <p class="text-sm text-gray-500">{{ mentor.title }}</p>
              </div>
            </div>
            <div class="mt-4">
              <div class="flex flex-wrap gap-2">
                <span v-for="skill in mentor.expertise" :key="skill"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-800 text-white">
                  {{ skill }}
                </span>
              </div>
            </div>
            <div class="mt-4">
              <p class="text-sm text-gray-500 line-clamp-3">{{ mentor.summary }}</p>
            </div>
            <div class="mt-6 flex justify-between items-center">
              <button @click="requestSession(mentor)" class="btn-primary">
                Request Session
              </button>
              <a :href="mentor.profile_url" target="_blank" rel="noopener noreferrer"
                class="text-sm text-military-blue hover:text-olive-green">
                View Profile
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Add loading state -->
      <div v-if="jobsStore.loading" class="text-center py-8">
        <p class="text-gray-600">Loading mentors...</p>
      </div>

      <!-- Add error state -->
      <div v-if="jobsStore.error" class="text-center py-8">
        <p class="text-red-600">{{ jobsStore.error }}</p>
      </div>

      <!-- Session Request Modal -->
      <div v-if="showSessionModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Request Session with {{ selectedMentor?.name }}
          </h3>
          <div class="space-y-4">
            <div>
              <label for="session-date" class="block text-sm font-medium text-gray-700">
                Preferred Date
              </label>
              <input type="date" id="session-date" v-model="sessionRequest.date" class="input-field mt-1" />
            </div>
            <div>
              <label for="session-time" class="block text-sm font-medium text-gray-700">
                Preferred Time
              </label>
              <input type="time" id="session-time" v-model="sessionRequest.time" class="input-field mt-1" />
            </div>
            <div>
              <label for="session-notes" class="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea id="session-notes" v-model="sessionRequest.notes" rows="3" class="input-field mt-1"
                placeholder="What would you like to discuss?"></textarea>
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button @click="showSessionModal = false" class="btn-secondary">
              Cancel
            </button>
            <button @click="submitSessionRequest" class="btn-primary">
              Send Request
            </button>
          </div>
        </div>
      </div>

      <button class="fab" @click="handleSearch" :disabled="loading">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>

    <!-- Add Loading Modal -->
    <div v-if="loading" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg p-6 flex flex-col items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-military-blue mb-4"></div>
        <p class="text-gray-700 font-medium">Searching for mentors...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import { useMentorsStore } from '@/stores/mentors'
import { useJobsStore } from '@/stores/jobs'

const searchQuery = ref('')
const selectedMos = ref('')
const selectedIndustry = ref('')
const showSessionModal = ref(false)
const selectedMentor = ref(null)
const loading = ref(false)

const sessionRequest = ref({
  date: '',
  time: '',
  notes: ''
})

const mentorsStore = useMentorsStore()
const jobsStore = useJobsStore()

const mosOptions = [
  '11B - Infantryman',
  '25B - Information Technology Specialist',
  '68W - Healthcare Specialist',
  '92Y - Unit Supply Specialist'
]

const industryOptions = [
  'Information Technology',
  'Healthcare',
  'Logistics',
  'Construction',
  'Education',
  'Finance'
]

const requestSession = (mentor) => {
  selectedMentor.value = mentor
  showSessionModal.value = true
}

const viewProfile = (mentor) => {
  // Navigate to mentor profile page
  console.log('View profile:', mentor)
}

const submitSessionRequest = async () => {
  try {
    // Submit session request to backend
    console.log('Session request:', {
      mentor: selectedMentor.value,
      ...sessionRequest.value
    })
    toast.success('Session request sent successfully!')
    showSessionModal.value = false
  } catch (error) {
    toast.error('Failed to send session request')
  }
}

const handleSearch = async () => {
  try {
    loading.value = true
    await mentorsStore.searchMentors()
  } catch (error) {
    console.error('Error searching mentors:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await mentorsStore.fetchMentors()
})
</script>

<style scoped>
.fab {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #1a365d;
  /* military blue */
  color: white;
  border: none;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.fab:hover {
  background-color: #2c5282;
  /* slightly lighter military blue */
  transform: scale(1.05);
}

.fab:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>