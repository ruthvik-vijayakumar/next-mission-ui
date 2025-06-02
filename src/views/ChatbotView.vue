<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-military-blue">AI Assistant</h1>
        <p class="mt-2 text-gray-600">Get instant help with your transition journey</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Chat Area -->
        <div class="lg:col-span-2">
          <div class="bg-white shadow rounded-lg h-[600px] flex flex-col">
            <!-- Chat Messages -->
            <div class="flex-1 overflow-y-auto p-6 space-y-4" ref="chatContainer">
              <div
                v-for="(message, index) in messages"
                :key="index"
                class="flex"
                :class="message.isUser ? 'justify-end' : 'justify-start'"
              >
                <div
                  class="max-w-[70%] rounded-lg px-4 py-2"
                  :class="[
                    message.isUser
                      ? 'bg-military-blue text-white'
                      : 'bg-gray-100 text-gray-900'
                  ]"
                >
                  <p class="text-sm">{{ message.content }}</p>
                  <p class="text-xs mt-1 opacity-75">
                    {{ message.timestamp }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Input Area -->
            <div class="border-t border-gray-200 p-4">
              <div class="flex space-x-4">
                <div class="flex-1">
                  <input
                    type="text"
                    v-model="userInput"
                    @keyup.enter="sendMessage"
                    class="input-field"
                    placeholder="Type your message..."
                  />
                </div>
                <button
                  @click="sendMessage"
                  class="btn-primary"
                  :disabled="!userInput.trim()"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div class="space-y-3">
              <button
                v-for="action in quickActions"
                :key="action.id"
                @click="handleQuickAction(action)"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                {{ action.label }}
              </button>
            </div>
          </div>

          <!-- Suggested Topics -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Suggested Topics</h3>
            <div class="space-y-3">
              <button
                v-for="topic in suggestedTopics"
                :key="topic.id"
                @click="handleTopicClick(topic)"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                {{ topic.label }}
              </button>
            </div>
          </div>

          <!-- Resources -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Helpful Resources</h3>
            <div class="space-y-3">
              <a
                v-for="resource in resources"
                :key="resource.id"
                :href="resource.url"
                target="_blank"
                class="block px-4 py-2 text-sm text-military-blue hover:text-olive-green"
              >
                {{ resource.label }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { toast } from 'vue3-toastify'

const chatContainer = ref(null)
const userInput = ref('')
const messages = ref([
  {
    content: 'Hello! I\'m your AI assistant. How can I help you with your transition journey today?',
    isUser: false,
    timestamp: new Date().toLocaleTimeString()
  }
])

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

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const sendMessage = async () => {
  if (!userInput.value.trim()) return

  // Add user message
  messages.value.push({
    content: userInput.value,
    isUser: true,
    timestamp: new Date().toLocaleTimeString()
  })

  // Clear input
  const userMessage = userInput.value
  userInput.value = ''

  // Scroll to bottom
  await scrollToBottom()

  try {
    // Simulate AI response
    setTimeout(() => {
      messages.value.push({
        content: `I understand you're asking about "${userMessage}". Let me help you with that...`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      })
      scrollToBottom()
    }, 1000)
  } catch (error) {
    toast.error('Failed to get response from AI assistant')
  }
}

const handleQuickAction = (action) => {
  userInput.value = `I need help with ${action.label.toLowerCase()}`
  sendMessage()
}

const handleTopicClick = (topic) => {
  userInput.value = `Tell me more about ${topic.label.toLowerCase()}`
  sendMessage()
}

onMounted(() => {
  scrollToBottom()
})
</script> 