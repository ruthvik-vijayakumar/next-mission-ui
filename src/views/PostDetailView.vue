<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Back Button -->
      <button
        @click="router.back()"
        class="flex items-center text-gray-600 hover:text-military-blue mb-6"
      >
        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Forum
      </button>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-military-blue"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {{ error }}
      </div>

      <!-- Post Content -->
      <div v-else-if="post" class="space-y-8">
        <!-- Post Header -->
        <div class="bg-white rounded-lg">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-xl font-bold text-gray-900">{{ post.title }}</h1>
              <div class="flex items-center space-x-2 text-sm text-gray-500 mt-2">
                <span>{{ post.author?.firstName }} {{ post.author?.lastName }}</span>
                <span>•</span>
                <span>{{ formatDate(post.date) }}</span>
              </div>
            </div>
          </div>

          <!-- Post Content -->
          <div class="mt-6 text-gray-600 whitespace-pre-wrap">
            {{ post.content }}
          </div>

          <!-- Post Actions -->
          <div class="mt-6 flex items-center space-x-4">
            <button
              @click="likePost"
              class="flex items-center space-x-1 text-gray-500 hover:text-military-blue"
              :class="{ 'text-military-blue': post.isLiked }"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{{ post.likes }}</span>
            </button>
          </div>
        </div>

        <!-- Comments Section -->
        <div class="rounded-lg">
          <h2 class="text-lg font-semibold text-gray-900 mb-3">Comments ({{ post.commentCount }})</h2>

          <!-- Comment Form -->
          <div class="mb-8">
            <textarea
              v-model="newComment"
              rows="3"
              class="input-field w-full"
              placeholder="Write a comment..."
            ></textarea>
            <div class="mt-2 flex justify-end">
              <button
                @click="submitComment"
                :disabled="!newComment.trim()"
                class="btn-primary"
              >
                Post Comment
              </button>
            </div>
          </div>

          <!-- Comments List -->
          <div class="space-y-6">
            <div
              v-for="comment in post.comments"
              :key="comment.id"
              class="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
            >
              <div class="flex items-start justify-between">
                <div>
                  <div class="flex items-center space-x-2">
                    <span class="font-medium text-gray-900">
                      {{ comment.author?.firstName }} {{ comment.author?.lastName }}
                    </span>
                    <span class="text-sm text-gray-500">
                      {{ formatDate(comment.created_at) }}
                    </span>
                  </div>
                  <p class="mt-2 text-gray-600">{{ comment.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useForumStore } from '@/stores/forum'

const route = useRoute()
const router = useRouter()
const forumStore = useForumStore()

const post = ref(null)
const loading = ref(true)
const error = ref(null)
const newComment = ref('')
const commentsPage = ref(1)
const commentsPageSize = ref(10)

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(date).toLocaleDateString(undefined, options)
}

const toggleBookmark = () => {
  post.value.isBookmarked = !post.value.isBookmarked
}

const likePost = async () => {
  try {
    await forumStore.addReaction(post.value.id, 'like')
  } catch (error) {
    toast.error(error || 'Failed to like post')
  }
}

const submitComment = async () => {
  if (!newComment.value.trim()) return

  try {
    await forumStore.addComment(post.value.id, {
      content: newComment.value.trim()
    })
    newComment.value = ''
    await fetchPostAndComments(postId)
    toast.success('Comment added successfully')
  } catch (error) {
    toast.error(error || 'Failed to add comment')
  }
}

async function fetchPostAndComments(postId) {
  const [postDetails, commentsResponse] = await Promise.all([
      forumStore.fetchPostDetails(postId),
      forumStore.fetchComments(postId, commentsPage.value, commentsPageSize.value)
    ])
    
    post.value = {
      ...postDetails,
      comments: commentsResponse.results || commentsResponse
    }
}

onMounted(async () => {
  try {
    const postId = route.params.id
    await fetchPostAndComments(postId)
  } catch (err) {
    error.value = err.message || 'Failed to load post'
  } finally {
    loading.value = false
  }
})
</script> 