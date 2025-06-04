<template>
  <div class="min-h-screen bg-gray-50 py-4">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-4">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-xl font-bold text-military-blue">Veteran Forum</h1>
            <p class="mt-1 text-gray-600">Connect, share, and learn from fellow veterans</p>
          </div>
        </div>
      </div>

      <!-- FAB -->
      <button
        @click="showNewPostModal = true"
        class="fixed bottom-20 right-6 p-4 bg-military-blue text-white rounded-full shadow-lg hover:bg-opacity-90 transition-colors duration-200 z-10"
      >
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>

      <!-- Top Bar: Search, Filter -->
      <div class="flex items-center justify-between mb-2 gap-2">
        <!-- Search Bar Container -->
        <div class="relative flex-1">
          <input
            v-model="searchQuery"
            type="text"
            class="w-full rounded-full pl-12 pr-4 py-2 border border-gray-200 shadow-sm focus:border-military-blue focus:ring-2 focus:ring-military-blue focus:ring-offset-2 transition-all duration-200 placeholder-gray-400 bg-white text-gray-700"
            placeholder="Search posts..."
          />
          <div class="absolute left-4 top-1/2 -translate-y-1/2">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          </div>
        </div>

        <!-- Filter Button -->
        <button 
          @click="showFilterModal = true" 
          class="inline-flex items-center px-5 py-2 rounded-full bg-white text-military-blue  border border-gray-200 hover:bg-military-blue/90 focus:outline-none focus:ring-2 focus:ring-military-blue focus:ring-offset-2 transition-all duration-200 font-medium"
        >
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M6 6h12M9 14h6M12 18h0" />
          </svg>
          Filter
        </button>
      </div>

      <!-- Filter/Sort Modal (Tailwind UI style) -->
      <transition name="fade">
        <div v-if="showFilterModal" class="fixed inset-0 z-50 flex items-center justify-center">
          <!-- Overlay -->
          <div class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" @click="showFilterModal = false" aria-hidden="true"></div>
          <!-- Modal panel -->
          <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto px-6 py-6 sm:px-8 sm:py-8 flex flex-col focus:outline-none">
            <!-- Modal header -->
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-military-blue">Filter & Sort</h3>
              <button @click="showFilterModal = false" class="rounded-full p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-military-blue">
                <span class="sr-only">Close modal</span>
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <!-- Modal content -->
            <div class="space-y-5">
              <div>
                <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
                <select
                  id="category"
                  v-model="selectedCategory"
                  class="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-military-blue focus:ring-military-blue"
                >
                  <option value="">All Categories</option>
                  <option v-for="category in categories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>
              <div>
                <label for="sort" class="block text-sm font-medium text-gray-700">Sort By</label>
                <select
                  id="sort"
                  v-model="sortBy"
                  class="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-military-blue focus:ring-military-blue"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="comments">Most Comments</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Tags</label>
                <div class="mt-1 flex flex-wrap gap-2">
                  <button
                    v-for="tag in selectedTags"
                    :key="tag"
                    @click="toggleTag(tag)"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-military-blue transition"
                    :class="[
                      activeTags.includes(tag)
                        ? 'bg-military-blue text-white'
                        : 'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ tag }}
                  </button>
                </div>
              </div>
            </div>
            <!-- Modal actions -->
            <div class="mt-8 flex justify-end">
              <button @click="showFilterModal = false" class="inline-flex justify-center rounded-md border border-transparent bg-military-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-military-blue-dark focus:outline-none focus:ring-2 focus:ring-military-blue focus:ring-offset-2 transition">
                Apply
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Posts List -->
      <div class="space-y-6">
        <PostCard
          v-for="post in filteredPosts"
          :key="post.id"
          :post="post"
          @show-comments="showComments"
        />
      </div>

      <!-- Create Post Modal -->
      <CreatePostModal v-model="showNewPostModal"  />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import { useForumStore } from '@/stores/forum'
import PostCard from '@/components/PostCard.vue'
import CreatePostModal from '@/components/CreatePostModal.vue'

const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('recent')
const activeTags = ref([])
const showNewPostModal = ref(false)
const showFilterModal = ref(false)

const categories = [
  'Job Search',
  'Career Transition',
  'Education',
  'Business',
  'Wellness',
  'Housing',
  'Benefits'
]

const selectedTags = [
  'Resume Help',
  'Interview Tips',
  'Networking',
  'Education',
  'Benefits',
  'Mental Health',
  'Housing'
]

const forumStore = useForumStore()

const posts = computed(() => forumStore.posts)

const filteredPosts = computed(() => {
  return posts.value.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !selectedCategory.value || post.category === selectedCategory.value
    const matchesTags = activeTags.value.length === 0 ||
                       activeTags.value.some(tag => post.tags.includes(tag))
    return matchesSearch && matchesCategory && matchesTags
  }).sort((a, b) => {
    switch (sortBy.value) {
      case 'popular':
        return b.likes - a.likes
      case 'comments':
        return b.comments.length - a.comments.length
      default:
        return new Date(b.date) - new Date(a.date)
    }
  })
})

const toggleTag = (tag) => {
  const index = activeTags.value.indexOf(tag)
  if (index === -1) {
    activeTags.value.push(tag)
  } else {
    activeTags.value.splice(index, 1)
  }
}

const toggleNewPostTag = (tag) => {
  const index = newPost.value.tags.indexOf(tag)
  if (index === -1) {
    newPost.value.tags.push(tag)
  } else {
    newPost.value.tags.splice(index, 1)
  }
}

const toggleAnonymous = (post) => {
  post.isAnonymous = !post.isAnonymous
}

const toggleBookmark = (post) => {
  post.isBookmarked = !post.isBookmarked
}

const likePost = async (post) => {
  try {
    await forumStore.addReaction(post.id, 'like')
  } catch (error) {
    toast.error(error || 'Failed to like post')
  }
}

const showComments = async (post) => {
  try {
    await forumStore.fetchPostDetails(post.id)
    // Handle showing comments modal or navigation
  } catch (error) {
    toast.error(error || 'Failed to fetch post details')
  }
}

const handleImageUpload = (event) => {
  const files = Array.from(event.target.files)
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']

  files.forEach(file => {
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PNG, JPG, and GIF files are allowed')
      return
    }

    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      newPost.value.images.push({
        file,
        preview: e.target.result
      })
    }
    reader.readAsDataURL(file)
  })
}

const removeImage = (index) => {
  newPost.value.images.splice(index, 1)
}

// Add this helper function for date formatting
const formatDate = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(date).toLocaleDateString(undefined, options)
}

const autoResizeTextarea = (event) => {
  const textarea = event.target
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}

onMounted(async () => {
  try {
    await forumStore.fetchPosts()
  } catch (error) {
    toast.error(error || 'Failed to fetch posts')
  }
})
</script> 