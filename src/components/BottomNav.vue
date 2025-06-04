<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-around">
        <router-link
          to="/dashboard"
          class="flex flex-col items-center py-2 px-3 text-sm"
          :class="[
            $route.path === '/dashboard'
              ? 'text-military-blue'
              : 'text-gray-500 hover:text-military-blue'
          ]"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="mt-1">Home</span>
        </router-link>

        <router-link
          to="/forum"
          class="flex flex-col items-center py-2 px-3 text-sm"
          :class="[
            $route.path === '/forum'
              ? 'text-military-blue'
              : 'text-gray-500 hover:text-military-blue'
          ]"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          <span class="mt-1">Forum</span>
        </router-link>

        <router-link
          to="/chatbot"
          class="flex flex-col items-center py-2 px-3 text-sm"
          :class="[
            $route.path === '/chatbot'
              ? 'text-military-blue'
              : 'text-gray-500 hover:text-military-blue'
          ]"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span class="mt-1">Assistant</span>
        </router-link>

        <router-link
          to="/profile"
          class="flex flex-col items-center py-2 px-3 text-sm"
          :class="[
            $route.path === '/profile'
              ? 'text-military-blue'
              : 'text-gray-500 hover:text-military-blue'
          ]"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="mt-1">Profile</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const logout = async () => {
  await authStore.logout()
  router.push('/auth')
}
</script> 