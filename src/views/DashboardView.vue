<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Welcome Section -->
    <div class="bg-military-blue text-white py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold">Welcome back, {{ user?.name || 'Veteran' }}</h1>
        <p class="mt-2 text-gray-200">Your transition journey continues here</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- CTA Tiles -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
        <div
          v-for="cta in ctaTiles"
          :key="cta.id"
          class="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          @click="handleCtaClick(cta.id)"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <component :is="cta.icon" class="h-12 w-12 text-military-blue" />
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">{{ cta.title }}</h3>
              <p class="mt-1 text-sm text-gray-500">{{ cta.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Announcements -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Latest Updates</h2>
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul class="divide-y divide-gray-200">
            <li v-for="announcement in announcements" :key="announcement.id">
              <div class="px-4 py-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-military-blue truncate">
                    {{ announcement.title }}
                  </p>
                  <div class="ml-2 flex-shrink-0 flex">
                    <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {{ announcement.category }}
                    </p>
                  </div>
                </div>
                <div class="mt-2 sm:flex sm:justify-between">
                  <div class="sm:flex">
                    <p class="flex items-center text-sm text-gray-500">
                      {{ announcement.description }}
                    </p>
                  </div>
                  <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      {{ announcement.date }}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
        </div>

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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const user = ref(authStore.user)

const ctaTiles = [
  {
    id: 'jobs',
    title: 'Search Jobs by MOS',
    description: 'Find civilian positions matching your military experience',
    icon: 'BriefcaseIcon'
  },
  {
    id: 'mentor',
    title: 'Connect with a Mentor',
    description: 'Get guidance from experienced professionals',
    icon: 'UserGroupIcon'
  },
  {
    id: 'business',
    title: 'Start My Business',
    description: 'Launch your entrepreneurial journey',
    icon: 'LightBulbIcon'
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

const upcomingEvents = [
  {
    id: 1,
    title: 'Resume Workshop',
    date: 'Tomorrow, 2:00 PM EST'
  },
  {
    id: 2,
    title: 'Networking Mixer',
    date: 'Friday, 6:00 PM EST'
  }
]

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
      router.push('/business')
      break
  }
}

onMounted(() => {
  // Fetch user data and other dashboard information
})
</script> 