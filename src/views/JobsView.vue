<template>
  <div class="min-h-screen bg-gray-50">
    <!-- App Bar -->
    <div class="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm flex items-center h-14 px-2">
      <button @click="$router.back()" class="mr-1 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-military-blue">

        <svg class="h-6 w-6 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M20 12H4M4 12L10 18M4 12L10 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
 </svg>

      </button>
      <h1 class="flex-1 text-base font-semibold text-gray-900">Job Search</h1>
      <span class="w-8"></span> <!-- Spacer to balance the back button -->
    </div>

    <!-- Top Tabs -->
    <div class="bg-white sticky top-0 z-20">
      <div class="max-w-2xl mx-auto flex items-center px-4 py-2">
        <nav class="flex-1 flex space-x-2 overflow-x-auto">
          <button class="px-4 py-2 border-b-2 border-military-blue text-military-blue font-semibold focus:outline-none">For you</button>
          <button class="px-4 py-2 border-b-2 border-transparent text-gray-500 hover:text-military-blue hover:border-military-blue transition focus:outline-none relative">Liked<span class="ml-1 text-xs font-bold bg-gray-200 text-gray-700 rounded-full px-1.5">25</span></button>
          <button class="px-4 py-2 border-b-2 border-transparent text-gray-500 hover:text-military-blue hover:border-military-blue transition focus:outline-none relative">Applied<span class="ml-1 text-xs font-bold bg-gray-200 text-gray-700 rounded-full px-1.5">4</span></button>
        </nav>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="bg-white sticky top-14 z-10 border-b border-gray-100">
      <div class="flex items-stretch px-4 py-2 gap-3">
        <!-- Filters Button -->
        <button @click="showFilter = !showFilter" class="inline-flex flex-1 items-center px-4 py-2 rounded-xl bg-white text-gray-900 shadow font-medium border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-military-blue relative">
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M6 6h12M9 14h6M12 18h0" />
          </svg>
          <div class="flex-1 text-left">Filters</div>
          <span class="ml-2 inline-flex items-center justify-center text-xs font-bold bg-black text-white rounded-full px-2 h-5">10</span>
        </button>
        <!-- Recommended Button -->
        <button class="inline-flex flex-1 items-center px-4 py-2 rounded-xl bg-white text-gray-900 shadow font-medium border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-military-blue">
          <div class="flex-1 text-left">Recommended</div>
          <svg class="h-4 w-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Job Cards List -->
    <div class="max-w-2xl mx-auto px-4 py-4 space-y-4">
      <div v-for="job in jobs" :key="job.id" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-2 relative">
        <!-- Top Row: Logo, time, alumni badge, match -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span class="text-lg font-semibold text-gray-600">{{ job.company.charAt(0) }}</span>
            </div>
            <!-- <span class="text-xs text-gray-500">{{ job.time }}</span> -->
            <!-- <span v-if="job.alumni" class="ml-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">{{ job.alumni }}</span> -->
          </div>
          <div class="flex items-center gap-2">
            <span :class="job.matchType === 'good' ? 'text-green-600' : 'text-yellow-600'" class="text-xs font-bold uppercase">{{ job.matchType === 'good' ? 'GOOD MATCH' : 'FAIR MATCH' }}</span>
            <div class="relative flex items-center justify-center">
              <svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" stroke-width="3" class="text-gray-200" />
                <circle cx="18" cy="18" r="16" stroke-width="3" :class="job.matchType === 'good' ? 'stroke-green-400' : 'stroke-yellow-400'" stroke-dasharray="100" :stroke-dashoffset="100 - job.match" />
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">{{ job.match }}</span>
            </div>
          </div>
        </div>
        <!-- Title, company, meta -->
        <div>
          <div class="font-semibold text-gray-900 leading-tight">{{ job.title }}</div>
          <div class="text-xs text-gray-500 mt-0.5">{{ job.company }} / {{ job.meta }}</div>
        </div>
        <!-- Info Chips: time and alumni -->
        <div class="flex flex-wrap gap-2 mt-1">
          <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">{{ job.time }}</span>
          <span v-if="job.alumni" class="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">{{ job.alumni }}</span>
        </div>
        <!-- Tags -->
        <div class="flex flex-wrap gap-2 mt-1">
          <span v-for="tag in job.tags" :key="tag" class="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium">{{ tag }}</span>
        </div>
        <!-- Start date -->
        <!-- <div class="text-xs text-gray-500 mt-1">{{ job.start }}</div> -->
        <!-- Applicants and menu -->
        <div class="flex items-center justify-between mt-2">
          <span class="text-xs text-gray-400">{{ job.applicants }} applicants</span>
          <button class="p-1 rounded-full hover:bg-gray-100 focus:outline-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="6" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="18" r="1.5"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <button 
      class="fab"
      @click="handleSearch"
      :disabled="loading"
    >
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>

    <!-- Add loading modal -->
    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p class="font-medium">Fetching jobs, please wait...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useJobsStore } from '@/stores/jobs'
import { storeToRefs } from 'pinia'

const jobsStore = useJobsStore()
const showFilter = ref(false)
const { loading } = storeToRefs(jobsStore)

// Transform backend data to match component format
const jobs = computed(() => {
  return jobsStore.jobs.map(job => ({
    id: job.fingerprint,
    logo: `/company-logos/${job.company_name.toLowerCase().replace(/\s+/g, '-')}.png`, // You'll need to handle company logos
    title: job.job_title,
    company: job.company_name,
    meta: `${job.location} • ${job.employment_type} • ${job.work_mode}`,
    time: formatPostedTime(job.posted_time),
    match: Math.round(job.matching_score),
    matchType: job.matching_score >= 70 ? 'good' : 'fair',
    tags: job.job_tags,
    applicants: job.applicants,
    salary: job.salary ? `$${job.salary.from}k - $${job.salary.to}k` : null,
    url: job.url
  }))
})

console.log(jobs.value)

// Helper function to format posted time
function formatPostedTime(dateString) {
  if (!dateString) return 'Posted recently'
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Posted today'
  if (diffDays === 1) return 'Posted yesterday'
  if (diffDays < 7) return `Posted ${diffDays} days ago`
  if (diffDays < 30) return `Posted ${Math.floor(diffDays / 7)} weeks ago`
  return `Posted ${Math.floor(diffDays / 30)} months ago`
}

onMounted(() => {
  jobsStore.fetchJobs()
})

const handleSearch = async () => {
  try {
    await jobsStore.searchJobs()
  } catch (error) {
    console.error('Search failed:', error)
  }
}
</script>

<style scoped>
.fab {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #1a365d; /* military blue */
  color: white;
  border: none;
  box-shadow: 0 3px 5px rgba(0,0,0,0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.fab:hover {
  background-color: #2c5282; /* slightly lighter military blue */
  transform: scale(1.05);
}

.fab:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style> 