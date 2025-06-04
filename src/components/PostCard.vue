<template>
  <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
    <div class="p-4">
      <!-- Post Header -->
      <div class="flex items-start justify-between">
        <div class="flex-1 cursor-pointer" @click="navigateToPost">
          <h3 class="font-medium text-gray-900 hover:text-military-blue">
            {{ post.title }}
          </h3>
          <div class="flex items-center space-x-2 text-sm text-gray-500 mt-1">
            <span>{{ post.author.firstName }} {{ post.author.lastName }}</span>
            <span>•</span>
            <span>{{ formatDate(post.date) }}</span>
          </div>
        </div>
      </div>

      <!-- Post Content -->
      <div class="mt-3 text-gray-600 cursor-pointer" @click="navigateToPost">
        <p class="line-clamp-3">{{ post.content }}</p>
      </div>

      <div v-if="post.image" class="mt-3">
        <img :src="post.image" alt="Post Image" class="w-full h-full object-cover rounded-lg">
      </div>

      <!-- Post Footer -->
      <div class="mt-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button
            @click.stop="likePost"
            class="flex items-center space-x-1 text-gray-500 hover:text-military-blue"
            :class="{ 'text-military-blue': post.isLiked }"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{{ post.likes }}</span>
          </button>
          <button
            @click.stop="navigateToPost"
            class="flex items-center space-x-1 text-gray-500 hover:text-military-blue"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{{ post.commentCount }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toast } from 'vue3-toastify'
import router from '../router'
import { useForumStore } from '@/stores/forum'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const forumStore = useForumStore()

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(date).toLocaleDateString(undefined, options)
}

const navigateToPost = () => {
  router.push({ name: 'PostDetail', params: { id: props.post.id } })
}

const toggleBookmark = () => {
  props.post.isBookmarked = !props.post.isBookmarked
}

const likePost = async () => {
  try {
    await forumStore.addReaction(props.post.id, 'like')
  } catch (error) {
    toast.error(error || 'Failed to like post')
  }
}
</script> 