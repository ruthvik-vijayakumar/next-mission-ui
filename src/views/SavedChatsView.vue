<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-white shadow">
      <div class="max-w-7xl mx-auto px-3 py-2 sm:px-6 lg:px-8">
        <div class="flex items-center">
          <button @click="$router.back()"
            class="mr-1 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-military-blue">
            <svg class="h-6 w-6 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 12H4M4 12L10 18M4 12L10 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>
          <h1 class="text-lg font-semibold text-gray-900">Saved Chats</h1>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="chatStore.loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-military-blue"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="chatStore.error" class="bg-red-50 p-4 rounded-lg">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ chatStore.error }}</p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!chatStore.savedChats.length" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No saved chats</h3>
        <p class="mt-1 text-sm text-gray-500">Your bookmarked conversations will appear here.</p>
      </div>

      <!-- Chat List -->
      <div v-else class="space-y-4">
        <div
          v-for="(chat, idx) in chatStore.savedChats"
          :key="chat.id"
          class="bg-white shadow rounded-lg overflow-hidden"
        >
          <div class="p-4 flex flex-col">
            <div
              class="text-sm text-gray-900 prose prose-sm max-w-none transition-all duration-200"
              :class="!expanded[idx] ? 'line-clamp-4' : ''"
              v-html="renderMarkdown(chat.message)"
              :ref="el => setContentRef(el, idx)"
            ></div>
            <p class="mt-2 text-xs text-gray-500">
              {{ new Date(chat.created_at).toLocaleString() }}
            </p>
            <div v-if="overflowing[idx]" class="mt-2 flex justify-center">
              <button
                @click="toggleExpand(idx)"
                class="text-sm text-military-blue font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-military-blue"
              >
                {{ expanded[idx] ? 'Show less' : 'Read more' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick, watch } from 'vue'
import { useChatStore } from '@/stores/chat'
import { toast } from 'vue3-toastify'
import { marked } from 'marked'

const chatStore = useChatStore()
const expanded = ref([])
const overflowing = ref([])
const contentRefs = ref([])

function setContentRef(el, idx) {
  if (el) {
    contentRefs.value[idx] = el
  }
}

function checkOverflow() {
  for (let idx = 0; idx < chatStore.savedChats.length; idx++) {
    const el = contentRefs.value[idx]
    if (el) {
      // Remove clamp to measure full height
      el.classList.remove('line-clamp-4')
      const fullHeight = el.scrollHeight
      // Add clamp to measure clamped height (if not expanded)
      if (!expanded.value[idx]) {
        el.classList.add('line-clamp-4')
      }
      const clampedHeight = el.scrollHeight
      overflowing.value[idx] = fullHeight > clampedHeight + 2 // fudge for rounding
    }
  }
}

onMounted(async () => {
  await chatStore.fetchSavedChats()
  expanded.value = chatStore.savedChats.map(() => false)
  await nextTick()
  checkOverflow()
})

// Re-check overflow when chats or expansion state changes
watch(
  () => [chatStore.savedChats.length, JSON.stringify(expanded.value)],
  async () => {
    await nextTick()
    checkOverflow()
  }
)

const renderMarkdown = (content) => {
  return marked(content)
}

const toggleExpand = (idx) => {
  expanded.value[idx] = !expanded.value[idx]
}

const removeBookmark = async (chatId) => {
  try {
    await chatStore.removeBookmark(chatId)
    toast.success('Chat removed from bookmarks')
  } catch (error) {
    toast.error('Failed to remove bookmark')
  }
}
</script>

<style>
/* Add these styles to ensure proper markdown rendering */
.prose pre {
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.375rem;
  overflow-x: auto;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.prose ul {
  list-style-type: disc;
  padding-left: 1.5rem;
}

.prose ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
}

.prose blockquote {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  font-style: italic;
  color: #6b7280;
}

/* Clamp lines for card preview */
.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-height: 7.5em; /* fallback for browsers that don't support line-clamp */
}
</style>