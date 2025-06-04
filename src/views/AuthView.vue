<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <!-- <img class="mx-auto h-12 w-auto" src="" alt="Veteran Transition Platform" /> -->
        <h2 class="mt-6 text-center text-3xl font-extrabold text-military-blue">
          {{ isLogin ? 'Sign in to your account' : 'Create your account' }}
        </h2>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm space-y-4">
          <div v-if="!isLogin" class="grid grid-cols-2 gap-4">
            <div>
              <label for="first_name" class="block text-sm font-medium text-gray-700">First Name</label>
              <input id="first_name" v-model="form.first_name" type="text" required class="input-field mt-1"
                placeholder="First Name" />
            </div>
            <div>
              <label for="last_name" class="block text-sm font-medium text-gray-700">Last Name</label>
              <input id="last_name" v-model="form.last_name" type="text" required class="input-field mt-1"
                placeholder="Last Name" />
            </div>
          </div>

          <div v-if="!isLogin">
            <label for="dob" class="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input id="dob" v-model="form.date_of_birth" type="date" required class="input-field mt-1" :max="maxDate"
              :min="minDate" @change="formatDate" />
          </div>

          <div v-if="!isLogin" class="grid grid-cols-2 gap-4">
            <div>
              <label for="city" class="block text-sm font-medium text-gray-700">City</label>
              <input id="city" v-model="form.city" type="text" required class="input-field mt-1" placeholder="City" />
            </div>
            <div>
              <label for="state" class="block text-sm font-medium text-gray-700">State</label>
              <select id="state" v-model="form.state" required class="input-field mt-1">
                <option value="">Select State</option>
                <option v-for="state in states" :key="state.value" :value="state.value">
                  {{ state.label }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
            <input id="email" v-model="form.email" type="email" required class="input-field mt-1"
              placeholder="Email address" />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input id="password" v-model="form.password" type="password" required class="input-field mt-1"
              placeholder="Password" />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember-me" v-model="form.rememberMe" type="checkbox"
              class="h-4 w-4 text-military-blue focus:ring-military-blue border-gray-300 rounded" />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-military-blue hover:text-olive-green">
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <button type="submit" class="btn-primary w-full">
            {{ isLogin ? 'Sign in' : 'Sign up' }}
          </button>
        </div>

        <div class="text-center">
          <button type="button" @click="toggleMode" class="text-sm text-military-blue hover:text-olive-green">
            {{ isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue3-toastify'
import router from '@/router'

const authStore = useAuthStore()

const isLogin = ref(true)
const form = reactive({
  email: '',
  password: '',
  rememberMe: false,
  first_name: '',
  last_name: '',
  date_of_birth: '',
  city: '',
  state: ''
})

// Calculate max date (today) and min date (100 years ago)
const today = new Date()
const maxDate = computed(() => {
  return today.toISOString().split('T')[0]
})

const minDate = computed(() => {
  const minDate = new Date()
  minDate.setFullYear(today.getFullYear() - 100)
  return minDate.toISOString().split('T')[0]
})

// Format date to YYYY-MM-DD
const formatDate = (event) => {
  const date = new Date(event.target.value)
  if (!isNaN(date.getTime())) {
    form.date_of_birth = date.toISOString().split('T')[0]
  }
}

// Validate date before submission
const validateDate = () => {
  if (!form.date_of_birth) return false

  const date = new Date(form.date_of_birth)
  const today = new Date()
  const minDate = new Date()
  minDate.setFullYear(today.getFullYear() - 100)

  return date >= minDate && date <= today
}

// US States array
const states = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
]

const toggleMode = () => {
  isLogin.value = !isLogin.value
}

const handleSubmit = async () => {
  try {
    if (!isLogin.value && !validateDate()) {
      toast.error('Please enter a valid date of birth')
      return
    }

    if (isLogin.value) {
      await authStore.login(form.email, form.password)
      toast.success('Successfully logged in!')
      if (!authStore.onboarded) {
        router.push({ name: 'Onboarding' })
      } else {
        router.push('/dashboard')
      }

    } else {
      await authStore.register(form)
      toast.success('Account created successfully!')
      isLogin.value = true
      // router.push({ name: 'Onboarding' })
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'An error occurred')
  }
}

const handleLinkedInLogin = async () => {
  try {
    await authStore.linkedInLogin()
  } catch (error) {
    toast.error('LinkedIn login failed')
  }
}
</script>

<style scoped>
.input-field {
  @apply appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-military-blue focus:border-military-blue focus:z-10 sm:text-sm;
}
</style>