<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Add Loading Modal -->
    <div v-if="isLoading" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-military-blue mb-4"></div>
        <p class="text-gray-700 font-medium">Searching for new events...</p>
      </div>
    </div>

    <!-- Welcome Section -->
    <div class="bg-military-blue text-white py-8">
      <div class="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-semibold">Welcome back, {{ user?.name || 'Veteran' }}</h1>
        <p class="mt-1 text-gray-200">Your transition journey continues here at next mission</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-24">
      <!-- Expandable Checklist Section -->
      <div class="bg-white rounded-lg shadow-sm mb-6">
        <button @click="isChecklistExpanded = !isChecklistExpanded"
          class="w-full px-6 py-3 flex items-center justify-between focus:outline-none">
          <div class="flex items-center justify-between">
            <p class="text-sm font-semibold">Your pre-separation checklist</p>
            <p class="ml-2 text-xs text-gray-500">({{ completedSteps }}/{{ steps.length }} done)</p>
          </div>
          <svg class="h-5 w-5 text-gray-500 transform transition-transform duration-200"
            :class="{ 'rotate-180': isChecklistExpanded }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div v-show="isChecklistExpanded" class="px-6 pb-6 transition-all duration-200">
          <nav aria-label="Progress" class="mb-4">
            <ol role="list" class="overflow-hidden">
              <li v-for="(step, stepIdx) in steps" :key="step.name"
                :class="[stepIdx !== steps.length - 1 ? 'pb-4' : '', 'relative']">
                <template v-if="step.status === 'complete'">
                  <div v-if="stepIdx !== steps.length - 1"
                    class="absolute top-4 left-3 mt-0.5 h-full w-0.5 bg-military-blue" aria-hidden="true" />
                  <a :href="step.href" class="group relative flex items-start">
                    <span class="flex h-9 items-center">
                      <span
                        class="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-military-blue group-hover:bg-indigo-800">
                        <CheckIcon class="h-3 w-3 text-white" aria-hidden="true" />
                      </span>
                    </span>
                    <span class="ml-4 flex min-w-0 flex-col">
                      <span class="text-sm font-medium">{{ step.name }}</span>
                      <span class="text-sm text-gray-500">{{ step.description }}</span>
                    </span>
                  </a>
                </template>
                <template v-else-if="step.status === 'current'" condition="step.status === 'current'">
                  <div v-if="stepIdx !== steps.length - 1" class="absolute top-4 left-3 mt-0.5 h-full w-0.5 bg-gray-300"
                    aria-hidden="true" />
                  <a :href="step.href" class="group relative flex items-start" aria-current="step">
                    <span class="flex h-9 items-center" aria-hidden="true">
                      <span
                        class="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-military-blue bg-white">
                        <span class="h-2.5 w-2.5 rounded-full bg-military-blue" />
                      </span>
                    </span>
                    <span class="ml-4 flex min-w-0 flex-col">
                      <span class="text-sm font-medium text-military-blue">{{ step.name }}</span>
                      <span class="text-sm text-gray-500">{{ step.description }}</span>
                    </span>
                  </a>
                </template>
                <template v-else>
                  <div v-if="stepIdx !== steps.length - 1" class="absolute top-4 left-3 mt-0.5 h-full w-0.5 bg-gray-300"
                    aria-hidden="true" />
                  <a :href="step.href" class="group relative flex items-start">
                    <span class="flex h-9 items-center" aria-hidden="true">
                      <span
                        class="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-300 bg-white group-hover:border-gray-400">
                        <span class="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" />
                      </span>
                    </span>
                    <span class="ml-4 flex min-w-0 flex-col">
                      <span class="text-sm font-medium text-gray-500">{{ step.name }}</span>
                      <span class="text-sm text-gray-500">{{ step.description }}</span>
                    </span>
                  </a>
                </template>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div class="rounded-md bg-amber-50 p-4 mb-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <CheckCircleIcon class="h-5 w-5 text-green-400" aria-hidden="true" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-amber-800">VA Education Benefits Available</h3>
            <div class="mt-2 text-sm text-amber-700">
              <p>You may be eligible for the Post-9/11 GI Bill, which provides up to 36 months of education benefits.
                This
                includes tuition assistance, housing allowance, and book stipend.</p>
            </div>
            <div class="mt-4">
              <div class="-mx-2 -my-1.5 flex">
                <button type="button"
                  class="rounded-md px-2 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50">Check
                  Eligibility</button>
                <button type="button"
                  class="ml-3 rounded-md px-2 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50">Dismiss</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
        <div v-for="cta in ctaTiles" :key="cta.id"
          class="card px-5 py-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          @click="handleCtaClick(cta.id)">
          <div class="flex items-center relative">
            <div class="w-3/4">
              <h3 class="font-medium text-gray-900">{{ cta.title }}</h3>
              <p class="mt-1 text-sm text-gray-500">{{ cta.description }}</p>

              <div
                class="px-3 w-56 py-1 mt-2 rounded-full text-xs font-semibold bg-gradient-to-r from-military-blue to-transparent text-white shadow">
                24+ jobs available
              </div>

            </div>
            <div class="absolute -bottom-12 -right-8">
              <img :src="`/src/assets/images/${cta.image}`" class="w-36 h-36">
            </div>
          </div>
        </div>
      </div>

      <!-- Announcements -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-semibold text-gray-900">Latest Updates</h2>
          <button 
            @click="searchEvents" 
            class="px-4 py-2 text-military-blue font-semibold uppercase text-xs rounded-md"
          >
            Refresh Events
          </button>
        </div>
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul class="divide-y divide-gray-200">
            <li v-for="event in eventsStore.events" :key="event.fingerprint">
              <a :href="event.link" target="_blank" rel="noopener noreferrer" 
                 class="block hover:bg-gray-50 transition-colors duration-150">
                <div class="px-4 py-4 sm:px-6">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-military-blue truncate">
                      {{ event.name }}
                    </p>
                    <div class="ml-2 flex-shrink-0 flex">
                      <p
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {{ event.type }}
                      </p>
                    </div>
                  </div>
                  <div class="mt-2 sm:flex sm:justify-between">
                    <div class="sm:flex">
                      <p class="flex items-center text-sm text-gray-500">
                        {{ event.description }}
                      </p>
                    </div>
                    <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p v-if="event.date">
                        {{ event.date }} {{ event.time ? `at ${event.time}` : '' }}
                      </p>
                      <p v-else>
                        {{ event.location }}
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Quick Actions -->
      <!-- <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Upcoming Events</h3>
          <div class="space-y-4">
            <div v-for="event in upcomingEvents" :key="event.id" class="flex items-start">
              <div class="flex-shrink-0">
                <div class="flex items-center justify-center h-12 w-12 rounded-md bg-military-blue text-white">
                  <CalendarIcon class="h-6 w-6" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-900">{{ event.title }}</p>
                <p class="text-sm text-gray-500">{{ event.date }}</p>
              </div>
            </div>
          </div>
        </div> -->

        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Recommended Jobs</h3>
          <div class="space-y-4">
            <div v-for="job in recommendedJobs" :key="job.id" class="flex items-start">
              <div class="flex-shrink-0">
                <div class="flex items-center justify-center h-12 w-12 rounded-md bg-olive-green text-white">
                  <BriefcaseIcon class="h-6 w-6" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-900">{{ job.title }}</p>
                <p class="text-sm text-gray-500">{{ job.company }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Mentor Matches</h3>
          <div class="space-y-4">
            <div v-for="mentor in mentorMatches" :key="mentor.id" class="flex items-start">
              <div class="flex-shrink-0">
                <img class="h-12 w-12 rounded-full" :src="mentor.avatar" :alt="mentor.name" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-900">{{ mentor.name }}</p>
                <p class="text-sm text-gray-500">{{ mentor.expertise }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { CheckIcon } from '@heroicons/vue/24/solid'
import { useEventsStore } from '@/stores/events'
import { useWebSocketStore } from '@/stores/websocket'

const router = useRouter()
const authStore = useAuthStore()
const user = ref(authStore.user)
const websocketStore = useWebSocketStore()

const steps = ref([
  {
    name: 'VA Benefits Registration',
    description: 'Register for VA healthcare and benefits',
    status: 'complete',
    href: '#'
  },
  {
    name: 'Medical Records',
    description: 'Obtain copies of your medical and dental records',
    status: 'current',
    href: '#'
  },
  {
    name: 'DD-214 Preparation',
    description: 'Ensure all service records are up to date for DD-214',
    status: 'upcoming',
    href: '#'
  },
  {
    name: 'Financial Planning',
    description: 'Review TSP, set up direct deposit, and plan finances',
    status: 'upcoming',
    href: '#'
  },
  {
    name: 'Career Transition',
    description: 'Complete TAP classes and update resume',
    status: 'upcoming',
    href: '#'
  },
  {
    name: 'Insurance Coverage',
    description: 'Review and update life insurance and healthcare coverage',
    status: 'upcoming',
    href: '#'
  },
  {
    name: 'Final Outprocessing',
    description: 'Complete final medical exam and clear all installations',
    status: 'upcoming',
    href: '#'
  }
])

const ctaTiles = [
  {
    id: 'jobs',
    title: 'Search Jobs by MOS',
    description: 'Find civilian positions matching your military experience',
    icon: 'BriefcaseIcon',
    image: 'illustration.png'
  },
  {
    id: 'mentor',
    title: 'Connect with a Mentor',
    description: 'Get guidance from experienced professionals',
    icon: 'UserGroupIcon',
    image: 'mentor.png'
  },
  {
    id: 'business',
    title: 'Start My Business',
    description: 'Launch your entrepreneurial journey',
    icon: 'LightBulbIcon',
    image: 'business.png'
  }
]

const announcements = [
  {
    id: 1,
    title: 'New Veteran Hiring Initiative',
    description: 'Major tech companies announce special hiring programs for veterans',
    category: 'Jobs',
    date: '2 days ago'
  },
  {
    id: 2,
    title: 'Upcoming Career Fair',
    description: 'Virtual career fair with 50+ veteran-friendly employers',
    category: 'Events',
    date: '3 days ago'
  }
]

const upcomingEvents = ref([])

const recommendedJobs = [
  {
    id: 1,
    title: 'Project Manager',
    company: 'Tech Solutions Inc.'
  },
  {
    id: 2,
    title: 'Operations Director',
    company: 'Global Logistics'
  }
]

const mentorMatches = [
  {
    id: 1,
    name: 'John Smith',
    expertise: 'IT Leadership',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    expertise: 'Business Development',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
  }
]

const handleCtaClick = (id) => {
  switch (id) {
    case 'jobs':
      router.push('/jobs')
      break
    case 'mentor':
      router.push('/mentorship')
      break
    case 'business':
      router.push('/chatbot')
      // Send WebSocket message after navigation
      setTimeout(() => {
        const message = "i want to start a new business based on my vetran expereicne"
        websocketStore.sendMessage(message)
      }, 100)
      break
  }
}

// Add new ref for checklist expansion
const isChecklistExpanded = ref(false)

// Add computed property for completed steps
const completedSteps = computed(() => {
  return steps.value.filter(step => step.status === 'complete').length
})

const eventsStore = useEventsStore()

// Add new ref for events
const events = ref([])

// Add loading state
const isLoading = ref(false)

// Update the fetchEvents function
const fetchEvents = async () => {
  try {
    // This would be your actual API call
    const response = await eventsStore.searchEvents()
    events.value = response
    
    // Update upcomingEvents with the first 3 events that have dates
    upcomingEvents.value = events.value
      .filter(event => event.date)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3)
      .map(event => ({
        id: event.name,
        title: event.name,
        date: `${event.date}${event.time ? ` at ${event.time}` : ''}`
      }))
  } catch (error) {
    console.error('Error fetching events:', error)
  }
}

// Update the searchEvents function
const searchEvents = async () => {
  isLoading.value = true
  try {
    await fetchEvents()
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  eventsStore.fetchEvents()
})
</script>

<style scoped>
/* Add smooth transition for the expandable section */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Add to your existing styles */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>