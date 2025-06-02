<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex justify-between mb-2">
          <div v-for="(step, index) in steps" :key="index" class="text-sm font-medium text-gray-500">
            Step {{ index + 1 }}
          </div>
        </div>
        <div class="relative">
          <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div
              :style="{ width: `${((currentStep + 1) / steps.length) * 100}%` }"
              class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-military-blue transition-all duration-500"
            ></div>
          </div>
        </div>
      </div>

      <!-- Step Content -->
      <div class="bg-white shadow rounded-lg p-6">
        <!-- Step 1: DD-214 Upload -->
        <div v-if="currentStep === 0">
          <h2 class="text-2xl font-bold text-military-blue mb-6">Upload Your DD-214 Form</h2>
          <div class="space-y-6">
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div class="space-y-2">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <div class="text-sm text-gray-600">
                  <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-military-blue hover:text-olive-green focus-within:outline-none">
                    <span>Upload DD-214 Form</span>
                    <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleFileUpload" accept=".pdf,.jpg,.jpeg,.png">
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>

            <div class="text-center">
              <button
                @click="handleManualEntry"
                class="text-sm text-military-blue hover:text-olive-green"
              >
                Prefer to enter details manually?
              </button>
            </div>
          </div>
        </div>

        <!-- Step 2: Basic Info -->
        <div v-if="currentStep === 1">
          <h2 class="text-2xl font-bold text-military-blue mb-6">Tell Us About Yourself</h2>
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="name"
                v-model="form.name"
                class="input-field mt-1"
                required
              />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                v-model="form.email"
                class="input-field mt-1"
                required
              />
            </div>
            <div>
              <label for="resume" class="block text-sm font-medium text-gray-700">Resume (Optional)</label>
              <input
                type="file"
                id="resume"
                @change="handleResumeUpload"
                class="input-field mt-1"
                accept=".pdf,.doc,.docx"
              />
            </div>
          </div>
        </div>

        <!-- Step 3: Transition Goal -->
        <div v-if="currentStep === 2">
          <h2 class="text-2xl font-bold text-military-blue mb-6">What's Your Goal?</h2>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <button
              v-for="goal in transitionGoals"
              :key="goal.id"
              @click="form.transitionGoal = goal.id"
              class="card hover:border-military-blue hover:border-2 transition-all duration-200"
              :class="{ 'border-2 border-military-blue': form.transitionGoal === goal.id }"
            >
              <div class="text-center">
                <component :is="goal.icon" class="mx-auto h-12 w-12 text-military-blue" />
                <h3 class="mt-2 text-lg font-medium text-gray-900">{{ goal.title }}</h3>
                <p class="mt-1 text-sm text-gray-500">{{ goal.description }}</p>
              </div>
            </button>
          </div>
        </div>

        <!-- Step 4: Interest Sectors -->
        <div v-if="currentStep === 3">
          <h2 class="text-2xl font-bold text-military-blue mb-6">Select Your Interest Sectors</h2>
          <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div
              v-for="sector in interestSectors"
              :key="sector.id"
              class="relative flex items-start"
            >
              <div class="flex items-center h-5">
                <input
                  :id="sector.id"
                  v-model="form.interestSectors"
                  :value="sector.id"
                  type="checkbox"
                  class="h-4 w-4 text-military-blue focus:ring-military-blue border-gray-300 rounded"
                />
              </div>
              <div class="ml-3 text-sm">
                <label :for="sector.id" class="font-medium text-gray-700">{{ sector.name }}</label>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="mt-8 flex justify-between">
          <button
            v-if="currentStep > 0"
            @click="currentStep--"
            class="btn-secondary"
          >
            Previous
          </button>
          <button
            v-if="currentStep < steps.length - 1"
            @click="currentStep++"
            class="btn-primary ml-auto"
          >
            Next
          </button>
          <button
            v-else
            @click="handleSubmit"
            class="btn-primary ml-auto"
          >
            Complete Onboarding
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const router = useRouter()
const currentStep = ref(0)

const steps = [
  'DD-214 Upload',
  'Basic Information',
  'Transition Goal',
  'Interest Sectors'
]

const form = reactive({
  name: '',
  email: '',
  resume: null,
  transitionGoal: null,
  interestSectors: []
})

const transitionGoals = [
  {
    id: 'job',
    title: 'Find a Job',
    description: 'Search for civilian career opportunities',
    icon: 'BriefcaseIcon'
  },
  {
    id: 'mentor',
    title: 'Find a Mentor',
    description: 'Connect with experienced professionals',
    icon: 'UserGroupIcon'
  },
  {
    id: 'business',
    title: 'Start a Business',
    description: 'Launch your entrepreneurial journey',
    icon: 'LightBulbIcon'
  }
]

const interestSectors = [
  { id: 'it', name: 'Information Technology' },
  { id: 'healthcare', name: 'Healthcare' },
  { id: 'logistics', name: 'Logistics' },
  { id: 'construction', name: 'Construction' },
  { id: 'education', name: 'Education' },
  { id: 'finance', name: 'Finance' }
]

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Handle file upload logic here
    console.log('File uploaded:', file)
    currentStep.value++
  }
}

const handleManualEntry = () => {
  // Show manual entry form
  currentStep.value++
}

const handleResumeUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.resume = file
  }
}

const handleSubmit = async () => {
  try {
    // Submit form data to backend
    console.log('Form submitted:', form)
    toast.success('Onboarding completed successfully!')
    router.push('/dashboard')
  } catch (error) {
    toast.error('Error completing onboarding')
  }
}
</script> 