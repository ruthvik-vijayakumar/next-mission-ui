<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-military-blue">Find Your Mentor</h1>
        <p class="mt-2 text-gray-600">Connect with experienced professionals who understand your journey</p>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white shadow rounded-lg p-6 mb-8">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                id="search"
                v-model="searchQuery"
                class="input-field"
                placeholder="Search by name or expertise"
              />
            </div>
          </div>
          <div>
            <label for="mos" class="block text-sm font-medium text-gray-700">Military Background</label>
            <select
              id="mos"
              v-model="selectedMos"
              class="input-field mt-1"
            >
              <option value="">Any MOS</option>
              <option v-for="mos in mosOptions" :key="mos" :value="mos">
                {{ mos }}
              </option>
            </select>
          </div>
          <div>
            <label for="industry" class="block text-sm font-medium text-gray-700">Industry</label>
            <select
              id="industry"
              v-model="selectedIndustry"
              class="input-field mt-1"
            >
              <option value="">Any Industry</option>
              <option v-for="industry in industryOptions" :key="industry" :value="industry">
                {{ industry }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Mentor Grid -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="mentor in filteredMentors"
          :key="mentor.id"
          class="bg-white shadow rounded-lg overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-center">
              <img
                class="h-16 w-16 rounded-full"
                :src="mentor.avatar"
                :alt="mentor.name"
              />
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">{{ mentor.name }}</h3>
                <p class="text-sm text-gray-500">{{ mentor.title }}</p>
              </div>
            </div>
            <div class="mt-4">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in mentor.tags"
                  :key="tag"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-military-blue text-white"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            <div class="mt-4">
              <p class="text-sm text-gray-500">{{ mentor.bio }}</p>
            </div>
            <div class="mt-6 flex justify-between">
              <button
                @click="requestSession(mentor)"
                class="btn-primary"
              >
                Request Session
              </button>
              <button
                @click="viewProfile(mentor)"
                class="text-sm text-military-blue hover:text-olive-green"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Session Request Modal -->
      <div
        v-if="showSessionModal"
        class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4"
      >
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Request Session with {{ selectedMentor?.name }}
          </h3>
          <div class="space-y-4">
            <div>
              <label for="session-date" class="block text-sm font-medium text-gray-700">
                Preferred Date
              </label>
              <input
                type="date"
                id="session-date"
                v-model="sessionRequest.date"
                class="input-field mt-1"
              />
            </div>
            <div>
              <label for="session-time" class="block text-sm font-medium text-gray-700">
                Preferred Time
              </label>
              <input
                type="time"
                id="session-time"
                v-model="sessionRequest.time"
                class="input-field mt-1"
              />
            </div>
            <div>
              <label for="session-notes" class="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="session-notes"
                v-model="sessionRequest.notes"
                rows="3"
                class="input-field mt-1"
                placeholder="What would you like to discuss?"
              ></textarea>
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button
              @click="showSessionModal = false"
              class="btn-secondary"
            >
              Cancel
            </button>
            <button
              @click="submitSessionRequest"
              class="btn-primary"
            >
              Send Request
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { toast } from 'vue3-toastify'

const searchQuery = ref('')
const selectedMos = ref('')
const selectedIndustry = ref('')
const showSessionModal = ref(false)
const selectedMentor = ref(null)

const sessionRequest = ref({
  date: '',
  time: '',
  notes: ''
})

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

const mentors = [
  {
    id: 1,
    name: 'John Smith',
    title: 'IT Director',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    tags: ['Army Veteran', 'IT Leadership', 'Career Transition'],
    bio: 'Former Army IT Specialist with 15 years of experience in technology leadership.',
    mos: '25B',
    industry: 'Information Technology'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    title: 'Healthcare Administrator',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    tags: ['Navy Veteran', 'Healthcare', 'Business Development'],
    bio: 'Navy veteran with expertise in healthcare administration and business development.',
    mos: '68W',
    industry: 'Healthcare'
  }
]

const filteredMentors = computed(() => {
  return mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         mentor.bio.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesMos = !selectedMos.value || mentor.mos === selectedMos.value.split(' - ')[0]
    const matchesIndustry = !selectedIndustry.value || mentor.industry === selectedIndustry.value
    return matchesSearch && matchesMos && matchesIndustry
  })
})

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
</script> 