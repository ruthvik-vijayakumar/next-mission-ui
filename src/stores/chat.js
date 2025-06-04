import { defineStore } from 'pinia'
import axios from 'axios'
import api from '../utils/axios'
import { useAuthStore } from './auth'

const authStore = useAuthStore()

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [{
      content: `# Welcome! 👋

I'm your AI assistant, here to help with your transition journey. I can assist you with:

* Resume reviews
* Career path suggestions
* Benefits information
* Education opportunities

How can I help you today?`,
      isUser: false,
      timestamp: new Date().toLocaleTimeString()
    }],
    bookmarkedMessages: [],
    hasUserSentMessage: false,
    savedChats: [],
    loading: false,
    error: null
  }),
  
  actions: {
    addMessage(message) {
      this.messages.push(message)
    },
    
    clearMessages() {
      this.messages = [{
        content: `# Welcome! 👋

I'm your AI assistant, here to help with your transition journey. I can assist you with:

* Resume reviews
* Career path suggestions
* Benefits information
* Education opportunities

How can I help you today?`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      }]
    },
    
    toggleBookmark(message) {
      const index = this.bookmarkedMessages.findIndex(
        bookmarked => bookmarked.timestamp === message.timestamp && 
                     bookmarked.content === message.content
      )
      
      if (index === -1) {
        this.bookmarkedMessages.push(message)
      } else {
        this.bookmarkedMessages.splice(index, 1)
      }
    },
    
    clearBookmarks() {
      this.bookmarkedMessages = []
    },
    
    setUserSentMessage(value) {
      this.hasUserSentMessage = value
    },
    
    async fetchSavedChats() {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('chat/bookmark/all')
        console.log(response)
        this.savedChats = response.data
      } catch (error) {
        this.error = error.message || 'Failed to fetch saved chats'
        throw error
      } finally {
        this.loading = false
      }
    },

    async removeBookmark(chatId) {
      try {
        await api.delete(`chat/bookmark/${chatId}`)
        this.savedChats = this.savedChats.filter(chat => chat.id !== chatId)
      } catch (error) {
        throw new Error('Failed to remove bookmark')
      }
    }
  },
  
  persist: {
    key: 'chat-store',
    storage: localStorage,
    paths: ['messages', 'bookmarkedMessages', 'hasUserSentMessage', 'savedChats']
  }
}) 