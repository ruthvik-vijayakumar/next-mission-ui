<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Add Welcome Header -->
    <div class="absolute top-8 left-0 right-0 text-center z-10 px-2">
      <h1 class="text-xl font-bold text-military-blue mb-1">Welcome to Your Transition Journey</h1>
      <p class="text-gray-600">Let's get you set up for success in <br/> your civilian career</p>
    </div>

    <!-- Full Page Carousel -->
    <div class="relative h-screen">
      <!-- Carousel Content -->
      <div class="h-full">
        <div v-for="(step, index) in steps" :key="index" 
             class="absolute inset-0 transition-opacity duration-500"
             :class="{ 'opacity-100': currentStep === index, 'opacity-0 pointer-events-none': currentStep !== index }">
          <div class="h-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
            <!-- Step Content -->
            <!-- <img src="@/assets/images/transition.png" height="256" width="256" alt="logo" class="w-128 h-128"> -->
            <div class="max-w-3xl w-full p-4">
              <!-- Step 1: DD-214 Upload -->
              <div v-if="currentStep === 0">
                <div class="space-y-6">
                  <!-- Two wide rectangle buttons -->
                  <div class="grid grid-cols-2 gap-4">
                    <!-- Camera Button -->
                    <button 
                      @click="openCamera"
                      class="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-xl hover:border-military-blue hover:bg-military-blue/5 transition-all duration-200"
                    >
                      <svg class="w-6 h-6 text-military-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span class="font-medium text-sm text-gray-900 mt-1">Take a Photo</span>
                    </button>

                    <!-- Upload Button -->
                    <label 
                      class="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-xl hover:border-military-blue hover:bg-military-blue/5 transition-all duration-200 cursor-pointer"
                    >
                      <svg class="w-6 h-6 text-military-blue mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span class="font-medium text-sm text-gray-900 mt-1">Upload Files</span>
                      <input 
                        type="file" 
                        class="hidden" 
                        @change="handleFileUpload" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple
                      >
                    </label>
                  </div>
                  <h2 class="text-sm text-center text-military-blue mb-6">Upload any of the <span class="font-bold">DD214, JST, or DD2586</span> forms</h2>


                  <!-- File List -->
                  <div v-if="uploadedFiles.length > 0" class="mt-4">
                    <!-- Fixed header -->
                    <div class="flex justify-between items-center mb-2">
                      <h3 class="text-sm font-medium text-gray-700">Selected Files</h3>
                      <span class="text-sm text-gray-500">{{ uploadedFiles.length }} file{{ uploadedFiles.length > 1 ? 's' : '' }} selected</span>
                    </div>
                    
                    <!-- Scrollable list container -->
                    <div class="border border-gray-200 rounded-lg">
                      <div class="max-h-[200px] overflow-y-auto custom-scrollbar">
                        <div class="divide-y divide-gray-200">
                          <div v-for="(file, index) in uploadedFiles" :key="index" 
                               class="flex items-center justify-between p-3 bg-white hover:bg-gray-50">
                            <div class="flex items-center min-w-0">
                              <svg class="w-5 h-5 text-military-blue mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              <div class="min-w-0 flex-1">
                                <p class="text-sm font-medium text-gray-900 truncate" :title="file.name">{{ trimFileName(file.name) }}</p>
                                <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }} • {{ getFileType(file.name) }}</p>
                              </div>
                            </div>
                            <button @click="removeFile(index)" class="text-gray-400 hover:text-red-500 ml-2 flex-shrink-0">
                              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Manual Entry Text Button -->
                  <div class="text-center pt-2">
                    <button
                      @click="handleManualEntry"
                      class="text-military-blue hover:text-olive-green font-medium transition-colors duration-200"
                    >
                      Prefer to enter details manually?
                    </button>
                  </div>
                </div>
              </div>

              <!-- Step 2: Basic Info -->
              <div v-if="currentStep === 1">
                <div class="space-y-3">
                  <div>
                    <label for="branch" class="block text-sm font-medium text-gray-700">Branch of Service</label>
                    <select
                      id="branch"
                      v-model="form.branch_of_service"
                      class="input-field mt-1"
                      required
                    >
                      <option value="US Army">US Army</option>
                      <option value="US Army Reserve">US Army Reserve</option>
                      <option value="US Navy">US Navy</option>
                      <option value="US Marine Corps">US Marine Corps</option>
                      <option value="US Air Force">US Air Force</option>
                      <option value="US Space Force">US Space Force</option>
                      <option value="US Coast Guard">US Coast Guard</option>
                    </select>
                  </div>
                  <div>
                    <label for="pay_grade" class="block text-sm font-medium text-gray-700">Pay Grade</label>
                    <input
                      type="text"
                      id="pay_grade"
                      v-model="form.pay_grade"
                      class="input-field mt-1"
                      required
                    />
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="service_start" class="block text-sm font-medium text-gray-700">Service Start Date</label>
                      <input
                        type="date"
                        id="service_start"
                        v-model="form.service_start_date"
                        class="input-field mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label for="service_end" class="block text-sm font-medium text-gray-700">Service End Date</label>
                      <input
                        type="date"
                        id="service_end"
                        v-model="form.service_end_date"
                        class="input-field mt-1"
                        required
                      />
                    </div>
                  </div>
                  <!-- <div>
                    <label for="resume" class="block text-sm font-medium text-gray-700">Resume (Optional)</label>
                    <input
                      type="file"
                      id="resume"
                      @change="handleResumeUpload"
                      class="input-field mt-1"
                      accept=".pdf,.doc,.docx"
                    />
                  </div> -->

                  <!-- Add MOS History Section -->
                  <div class="mt-4">
                    <h3 class="text-sm font-medium text-gray-900 mb-2">MOS History</h3>
                    <div v-for="(mos, index) in form.mos_history" :key="index" class="bg-gray-50 p-4 rounded-lg mb-4">
                      <div class="grid grid-cols-2 gap-2">
                        <div>
                          <label class="block text-sm font-medium text-gray-700">MOS Code</label>
                          <input
                            type="text"
                            v-model="mos.code"
                            class="input-field mt-1"
                            required
                          />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700">MOS Title</label>
                          <input
                            type="text"
                            v-model="mos.title"
                            class="input-field mt-1"
                            required
                          />
                        </div>
                      </div>
                      <div class="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700">Start Date</label>
                          <input
                            type="date"
                            v-model="mos.start_date"
                            class="input-field mt-1"
                            required
                          />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700">End Date</label>
                          <input
                            type="date"
                            v-model="mos.end_date"
                            class="input-field mt-1"
                            required
                          />
                        </div>
                      </div>
                      <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700">Source</label>
                        <input
                          type="text"
                          v-model="mos.source"
                          class="input-field mt-1"
                          required
                        />
                      </div>
                      <button 
                        @click="removeMOS(index)" 
                        class="mt-4 text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove MOS
                      </button>
                    </div>
                    
                    <button 
                      @click="addMOS" 
                      class="mt-4 text-military-blue hover:text-military-blue-dark text-sm font-medium flex items-center"
                    >
                      <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Add MOS
                    </button>
                  </div>
                </div>
              </div>

              <!-- Step 3: Transition Goal -->
              <div v-if="currentStep === 2" class="space-y-6">
                <div class="text-center mb-4">
                  <p class="text-military-blue mb-2">What are you looking to achieve? <span class="text-gray-600">(Select all that apply)</span></p>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label
                    v-for="goal in transitionGoals"
                    :key="goal.id"
                    class="flex flex-col items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200"
                    :class="form.transitionGoal.includes(goal.id) ? 'border-military-blue bg-military-blue/10' : 'border-gray-200 bg-white'"
                  >
                    <input
                      type="checkbox"
                      class="hidden"
                      v-model="form.transitionGoal"
                      :value="goal.id"
                    />
                    <h3 class="font-semibold text-gray-900">{{ goal.title }}</h3>
                    <p class="mt-1 text-xs text-gray-500 text-center">{{ goal.description }}</p>
                  </label>
                </div>
              </div>

              <!-- Step 4: Interest Sectors -->
              <div v-if="currentStep === 3" class="space-y-6">
                <div class="text-center mb-8">
                  <p class="text-military-blue mb-2">Select Your Interest Sectors <span class="text-gray-600">(Choose the fields you're interested in)</span></p>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <button
                    v-for="sector in interestSectors"
                    :key="sector.id"
                    @click="toggleSector(sector.id)"
                    class="px-4 py-3 rounded-xl border-2 text-left transition-all duration-200"
                    :class="form.interestSectors.includes(sector.id) ? 'border-military-blue bg-military-blue/10' : 'border-gray-200 bg-white hover:border-military-blue/50'"
                  >
                    <span class="text-gray-800 font-medium">{{ sector.name }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Carousel Indicators -->
      <div class="absolute bottom-24 left-0 right-0 flex justify-center space-x-2">
        <button v-for="(step, index) in steps" :key="index"
                @click="currentStep = index"
                class="w-1 h-1 rounded-full transition-all duration-300"
                :class="currentStep === index ? 'bg-military-blue scale-125' : 'bg-gray-300'">
        </button>
      </div>

      <!-- Bottom Navigation -->
      <div class="absolute bottom-8 left-0 right-0 flex justify-center items-center space-x-4 px-6">
        <button 
          v-if="currentStep > 0 && currentStep !== 1"
          @click="currentStep--"
          class="btn-secondary flex-1 rounded-full px-6 py-3 flex items-center justify-center space-x-2 hover:scale-105 transition-transform"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </button>

        <button 
          v-if="currentStep < steps.length - 1"
          @click="handleNext"
          :disabled="currentStep === 0 && uploadedFiles.length === 0"
          :class="[
            'flex-1 rounded-full px-6 py-3 flex items-center justify-center space-x-2 hover:scale-105 transition-transform',
            currentStep === 0 && uploadedFiles.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'btn-primary'
          ]"
        >
          <span>Next</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button 
          v-else
          @click="handleSubmit"
          class="btn-primary flex-1 justify-center rounded-full px-6 py-3 flex items-center space-x-2 shadow-lg hover:scale-105 transition-transform"
        >
          <span>Complete</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Add this import at the top of the script section -->
    <!-- <CameraModal 
      :show="showCamera"
      @close="showCamera = false"
      @photo-taken="handlePhotoTaken"
    /> -->
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import CameraModal from '@/components/CameraModal.vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

import {authApi} from '@/utils/axios'

const router = useRouter()
const currentStep = ref(0)

const authStore = useAuthStore()

const steps = [
  'Verify Service',
  'Basic Info',
  'Goal',
  'Sectors'
]

const form = reactive({
  resume: null,
  transitionGoal: [],
  interestSectors: [],
  branch_of_service: '',
  pay_grade: '',
  service_start_date: '',
  service_end_date: '',
  mos_history: []
})

const transitionGoals = [
  {
    id: 'job',
    title: 'Find a Job',
    description: 'Search for civilian career opportunities',
  },
  {
    id: 'mentor',
    title: 'Find a Mentor',
    description: 'Connect with experienced professionals',
  },
  {
    id: 'business',
    title: 'Start a Business',
    description: 'Launch your entrepreneurial journey',
  },
  {
    id: 'skillup',
    title: 'Skill Up',
    description: 'Search for colleges, universities, programs and certificates',
  }
]

const interestSectors = [
  { id: 'it', name: 'IT' },
  { id: 'healthcare', name: 'Healthcare' },
  { id: 'logistics', name: 'Logistics' },
  { id: 'construction', name: 'Construction' },
  { id: 'education', name: 'Education' },
  { id: 'finance', name: 'Finance' }
]

const uploadedFiles = ref([])

const showCamera = ref(false)

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  uploadedFiles.value = [...uploadedFiles.value, ...files]
}

const removeFile = (index) => {
  uploadedFiles.value.splice(index, 1)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileType = (filename) => {
  return filename.split('.').pop().toUpperCase()
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
    // Make API request with document data from store
    const response = await authApi.post('update/user/data', authStore.documentData)
    console.log(response)
    if (response.status === 200) {
      authStore.onboarded = response.data.onboarded
      toast.success('Onboarding completed successfully!')
      router.push({name: 'Dashboard'})
    } else {
      throw new Error('Failed to update user data')
    }
  } catch (error) {
    console.error('Error updating user data:', error)
    toast.error('Error completing onboarding')
  }
}

const handlePhotoTaken = (file) => {
  uploadedFiles.value = [...uploadedFiles.value, file]
}

const trimFileName = (filename, maxLength = 25) => {
  if (filename.length <= maxLength) return filename
  const extension = filename.split('.').pop()
  const name = filename.slice(0, -(extension.length + 1))
  return `${name.slice(0, maxLength - extension.length - 3)}...${extension}`
}

const toggleSector = (sectorId) => {
  const index = form.interestSectors.indexOf(sectorId)
  if (index === -1) {
    form.interestSectors.push(sectorId)
  } else {
    form.interestSectors.splice(index, 1)
  }
}

const handleNext = async () => {
  if (currentStep.value === 0) {
    try {
      const response = await authStore.uploadDocument(uploadedFiles.value[0], 'dd214')
      authStore.setDocumentData(response)
      
      // Prefill form with DD214 data
      form.branch_of_service = response.form_data.branch_of_service
      form.pay_grade = response.form_data.pay_grade
      form.service_start_date = response.form_data.service_start_date
      form.service_end_date = response.form_data.service_end_date
      form.mos_history = response.form_data.mos_history
      
      toast.success('Documents uploaded successfully')
      currentStep.value++
      uploadedFiles.value = []
    } catch (error) {
      toast.error('Error uploading documents')
      console.error('Upload error:', error)
    }
  } else {
    currentStep.value++
  }
}

const addMOS = () => {
  form.mos_history.push({
    code: '',
    title: '',
    start_date: '',
    end_date: '',
    source: 'DD214'
  })
}

const removeMOS = (index) => {
  form.mos_history.splice(index, 1)
}

watch(
  () => ({
    branch_of_service: form.branch_of_service,
    pay_grade: form.pay_grade,
    service_start_date: form.service_start_date,
    service_end_date: form.service_end_date,
    mos_history: form.mos_history
  }),
  (newValue) => {
    if (authStore.documentData) {
      authStore.setDocumentData({
        ...authStore.documentData,
        form_data: {
          ...authStore.documentData.form_data,
          ...newValue
        }
      })
    }
  },
  { deep: true }
)

watch(
  () => form.interestSectors,
  (newValue) => {
    if (authStore.documentData) {
      const sectors = newValue.map(sector => sector.toLowerCase().replace(/\s+/g, '-'))
      authStore.setDocumentData({
        ...authStore.documentData,
        preferences: {
          ...authStore.documentData.preferences,
          interest_sectors: sectors
        }
      })
    }
  },
  { deep: true }
)

watch(
  () => form.transitionGoal,
  (newValue) => {
    if (authStore.documentData) {
      const goals = newValue.map(goal => goal.toLowerCase().replace(/\s+/g, '-'))
      authStore.setDocumentData({
        ...authStore.documentData,
        preferences: {
          ...authStore.documentData.preferences,
          transition_goals: goals
        }
      })
    }
  },
  { deep: true }
)
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #CBD5E0 #F7FAFC;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #F7FAFC;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #CBD5E0;
  border-radius: 3px;
}

.aspect-video {
  aspect-ratio: 16 / 9;
}
</style> 