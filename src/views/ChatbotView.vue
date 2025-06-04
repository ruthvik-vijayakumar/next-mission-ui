<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Move header outside the max-w-7xl container -->
    <div class="fixed w-full top-0 z-30 bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="px-2 py-2 flex items-center">
          <button @click="$router.back()"
            class="mr-1 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-military-blue">

            <svg class="h-6 w-6 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 12H4M4 12L10 18M4 12L10 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>

          </button>
          <div>
            <h1 class="text-base mb-0 font-semibold text-military-blue">AI Assistant</h1>
            <p class="text-gray-600">Get instant help with your transition journey</p>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col h-screen">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
        <!-- Main Chat Area -->
        <div class="lg:col-span-2 flex flex-col h-full">
          <div class="bg-white rounded-lg flex flex-col h-full relative">
            <!-- Chat Messages -->
            <div class="flex-1 overflow-y-auto p-5 space-y-4" ref="chatContainer"
              style="min-height:0; height: calc(100vh - 200px);">
              <div v-for="(message, index) in messages" :key="index" class="flex"
                :class="message.isUser ? 'justify-end' : 'justify-start'">
                <div :class="[
                  message.isUser
                    ? 'max-w-[70%] rounded-lg px-4 py-2 bg-military-blue text-white'
                    : 'w-full text-gray-900'
                ]">
                  <div class="flex justify-between items-start">
                    <div v-if="!message.isUser" class="prose prose-sm max-w-none flex-1"
                      v-html="renderMarkdown(message.content)"></div>
                    <!-- <div 
                      v-else-if="!message.isUser && index > 0" 
                      class="prose prose-sm max-w-none flex-1"
                      v-html="renderMarkdown(JSON.parse(message.content)[0].message)"
                    ></div> -->
                    <p v-else class="text-sm">{{ message.content }}</p>

                    <!-- Add bookmark button for assistant messages (except first message) -->
                    <button v-if="!message.isUser && index > 0" @click="toggleBookmark(message)"
                      class="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
                      <svg class="w-5 h-5 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>

                  <div v-if="message.actions" class="flex flex-wrap gap-2 mt-3 px-2">
                    <button v-for="action in message.actions" :key="action.action" @click="handleAction(action)"
                      class="rounded-full text-military-blue px-3 py-1 text-sm font-medium border border-military-blue hover:bg-military-blue hover:text-white focus:outline-none focus:ring-2 focus:ring-military-blue transition">
                      {{ truncateText(action.help_text, 30) }}
                    </button>
                  </div>


                  <p class="text-xs mt-3 opacity-75">
                    {{ message.timestamp }}
                  </p>
                </div>
              </div>

              <!-- Sidebar content as accordions below the first chat bubble -->
              <div v-if="messages.length && !hasUserSentMessage" class="mt-6 space-y-3">
                <!-- Quick Actions Accordion -->
                <div>
                  <button @click="openAccordion('quick')"
                    class="w-full flex justify-between items-center px-4 py-2 bg-gray-50 rounded-full border border-gray-200 text-military-blue font-semibold focus:outline-none">
                    Quick Actions
                    <svg :class="{ 'transform rotate-180': accordion.quick }" class="h-5 w-5 transition-transform"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div v-if="accordion.quick" class="flex flex-wrap gap-2 mt-3 px-2">
                    <button v-for="action in quickActions" :key="action.id" @click="handleQuickAction(action)"
                      class="rounded-full text-military-blue px-3 py-1 text-sm font-medium border border-military-blue hover:bg-military-blue hover:text-white focus:outline-none focus:ring-2 focus:ring-military-blue transition">
                      {{ action.label }}
                    </button>
                  </div>
                </div>
                <!-- Suggested Topics Accordion -->
                <div>
                  <button @click="openAccordion('topics')"
                    class="w-full flex justify-between items-center px-4 py-2 bg-gray-50 rounded-full border border-gray-200 text-military-blue font-semibold focus:outline-none">
                    Suggested Topics
                    <svg :class="{ 'transform rotate-180': accordion.topics }" class="h-5 w-5 transition-transform"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div v-if="accordion.topics" class="flex flex-wrap gap-2 mt-3 px-2">
                    <button v-for="topic in suggestedTopics" :key="topic.id" @click="handleTopicClick(topic)"
                      class="rounded-full text-military-blue px-3 py-1 text-sm font-medium border border-military-blue hover:bg-military-blue hover:text-white focus:outline-none focus:ring-2 focus:ring-military-blue transition">
                      {{ topic.label }}
                    </button>
                  </div>
                </div>
                <!-- Helpful Resources Accordion -->
                <div>
                  <button @click="openAccordion('resources')"
                    class="w-full flex justify-between items-center px-4 py-2 bg-gray-50 rounded-full border border-gray-200 text-military-blue font-semibold focus:outline-none">
                    Helpful Resources
                    <svg :class="{ 'transform rotate-180': accordion.resources }" class="h-5 w-5 transition-transform"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div v-if="accordion.resources" class="flex flex-wrap gap-2 mt-3 px-2">
                    <a v-for="resource in resources" :key="resource.id" :href="resource.url" target="_blank"
                      class="rounded-full text-military-blue px-3 py-1 text-sm font-medium border border-military-blue hover:bg-military-blue hover:text-white focus:outline-none focus:ring-2 focus:ring-military-blue transition">
                      {{ resource.label }}
                    </a>
                  </div>
                </div>
              </div>
              <!-- End sidebar content as accordions -->

            </div>

            <!-- Input Area -->
            <div class="sticky bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200 p-4">
              <div class="flex space-x-4">
                <div class="flex-1">
                  <input type="text" v-model="userInput" @keyup.enter="sendMessage" class="input-field rounded-full"
                    placeholder="Type your message..." />
                </div>
                <button @click="sendMessage" class="btn-primary rounded-full" :disabled="!userInput.trim()">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Remove Sidebar -->
      </div>
    </div>

    <!-- Add connection status indicator -->
    <div class="fixed top-4 right-4 z-50">
      <div class="flex items-center px-3 py-1 rounded-full text-sm"
        :class="isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
        <div class="w-2 h-2 rounded-full mr-2" :class="isConnected ? 'bg-green-500' : 'bg-red-500'"></div>
        {{ isConnected ? 'Connected' : 'Disconnected' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue'
import { toast } from 'vue3-toastify'
import { marked } from 'marked'
import { useChatStore } from '@/stores/chat'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/utils/axios'
import { useRouter } from 'vue-router'
const chatStore = useChatStore()
const authStore = useAuthStore()
const chatContainer = ref(null)
const userInput = ref('')
const ws = ref(null)
const isConnected = ref(false)
const initialMessageSent = ref(false)

// Get user ID from auth store
const userId = computed(() => authStore.user?.user_id)
const router = useRouter()
// Use store values instead of local refs
const messages = computed(() => chatStore.messages)
const bookmarkedMessages = computed(() => chatStore.bookmarkedMessages)
const hasUserSentMessage = computed(() => chatStore.hasUserSentMessage)

const quickActions = [
  { id: 1, label: 'Resume Review' },
  { id: 2, label: 'Career Path Suggestions' },
  { id: 3, label: 'Benefits Information' },
  { id: 4, label: 'Education Opportunities' }
]

const suggestedTopics = [
  { id: 1, label: 'Translating Military Experience' },
  { id: 2, label: 'Interview Preparation' },
  { id: 3, label: 'Networking Strategies' },
  { id: 4, label: 'Mental Health Support' }
]

const resources = [
  {
    id: 1,
    label: 'VA Benefits Guide',
    url: '#'
  },
  {
    id: 2,
    label: 'Career Transition Handbook',
    url: '#'
  },
  {
    id: 3,
    label: 'Education Benefits Calculator',
    url: '#'
  }
]

const accordion = ref({ quick: true, topics: false, resources: false })

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    // Direct scroll to bottom without animations
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

// Modify the watch to be more aggressive
watch(
  () => messages.value,
  () => {
    // Call scrollToBottom multiple times to ensure it works
    scrollToBottom()
    setTimeout(scrollToBottom, 100)
    setTimeout(scrollToBottom, 500)
  },
  { deep: true, immediate: true }
)

// WebSocket connection setup
const connectWebSocket = () => {
  if (!userId.value) {
    console.error('No user ID available')
    toast.error('Authentication required')
    return
  }

  ws.value = new WebSocket(`${import.meta.env.VITE_WS_URL}/ws/chat/${userId.value}/`)

  ws.value.onopen = () => {
    isConnected.value = true
    console.log('WebSocket connected')
    
    // Check for query message after connection is established
    const query = router.currentRoute.value.query
    if (query.message && !initialMessageSent.value) {
      userInput.value = query.message
      sendMessage()
      initialMessageSent.value = true
    }
  }

  ws.value.onclose = () => {
    isConnected.value = false
    console.log('WebSocket disconnected')
    // Attempt to reconnect after 5 seconds
    setTimeout(connectWebSocket, 5000)
  }

  ws.value.onerror = (error) => {
    console.error('WebSocket error:', error)
    toast.error('Connection error. Please try again.')
  }

  ws.value.onmessage = (event) => {
    try {
      const response = JSON.parse(event.data)
      const parsedResponse = JSON.parse(response.response)
      chatStore.addMessage({
        content: parsedResponse[0].message,
        isUser: false,
        actions: parsedResponse[0].actions,
        timestamp: new Date().toLocaleTimeString()
      })
      // Call scrollToBottom multiple times after message is added
      scrollToBottom()
      setTimeout(scrollToBottom, 100)
      setTimeout(scrollToBottom, 500)
    } catch (error) {
      console.error('Error parsing message:', error)
    }
  }
}

// Modified sendMessage function to use WebSocket
const sendMessage = async () => {
  if (!userInput.value.trim()) return

  chatStore.setUserSentMessage(true)

  // Add user message
  chatStore.addMessage({
    content: userInput.value,
    actions: null,
    isUser: true,
    timestamp: new Date().toLocaleTimeString()
  })

  // Send message through WebSocket
  if (ws.value && isConnected.value) {
    try {
      ws.value.send(JSON.stringify({
        message: userInput.value,
      }))
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    }
  } else {
    toast.error('Not connected to server')
  }

  userInput.value = ''
}

const handleQuickAction = (action) => {
  userInput.value = `I need help with ${action.label.toLowerCase()}`
  sendMessage()
}

const handleTopicClick = (topic) => {
  userInput.value = `Tell me more about ${topic.label.toLowerCase()}`
  sendMessage()
}

const openAccordion = (section) => {
  accordion.value = {
    quick: false,
    topics: false,
    resources: false
  }
  accordion.value[section] = !accordion.value[section]
}

const renderMarkdown = (content) => {
  return marked(content)
}

// Replace the toggleBookmark function with this new version
const toggleBookmark = async (message) => {
  try {
    const response = await api.post('chat/bookmark', {
      message: message.content
    });
    toast.success('Message bookmarked successfully');
  } catch (error) {
    console.error('Error bookmarking message:', error);
    toast.error('Failed to bookmark message');
  }
}

// Update refreshChat to also clear bookmarks
const refreshChat = () => {
  chatStore.clearMessages()
  chatStore.clearBookmarks()
  chatStore.setUserSentMessage(false)
  userInput.value = ''

  // Reset accordion state
  accordion.value = { quick: true, topics: false, resources: false }

  // Scroll to top
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = 0
    }
  })
}

// Clean up WebSocket connection on component unmount
onUnmounted(() => {
  if (ws.value) {
    ws.value.close()
  }
})

// Connect to WebSocket when component mounts
onMounted(() => {
  connectWebSocket()
  scrollToBottom()

  // Create a MutationObserver to watch for content changes
  const observer = new MutationObserver(() => {
    scrollToBottom()
  })

  if (chatContainer.value) {
    observer.observe(chatContainer.value, {
      childList: true,
      subtree: true,
      characterData: true
    })
  }

  onUnmounted(() => {
    observer.disconnect()
  })
})

const handleAction = (action) => {
  switch (action.action) {
    case 'link':
      window.open(action.do, '_blank')
      break
    case 'phone':
      window.location.href = `tel:${action.do}`
      break
    // case 'comment':
    //   userInput.value = action.do
    //   sendMessage()
    //   break
    default:
      console.warn('Unknown action type:', action.action)
  }
}

const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}
</script>

<style>
.prose {
  max-width: none;
}

.prose p {
  margin: 0.5em 0;
}

.prose ul {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.prose h1 {
  font-size: 1.5em;
  margin: 0.5em 0;
}

.prose h2 {
  font-size: 1.25em;
  margin: 0.5em 0;
}

.prose h3 {
  font-size: 1.1em;
  margin: 0.5em 0;
}

/* Add styles for the bookmark button */
.bookmark-button {
  transition: all 0.2s ease;
}

.bookmark-button:hover {
  transform: scale(1.1);
}
</style>