<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-military-blue">Veteran Forum</h1>
            <p class="mt-2 text-gray-600">Connect, share, and learn from fellow veterans</p>
          </div>
          <button
            @click="showNewPostModal = true"
            class="btn-primary"
          >
            Create New Post
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white shadow rounded-lg p-6 mb-8">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-4">
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              v-model="selectedCategory"
              class="input-field mt-1"
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
              class="input-field mt-1"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="comments">Most Comments</option>
            </select>
          </div>
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              id="search"
              v-model="searchQuery"
              class="input-field mt-1"
              placeholder="Search posts..."
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Tags</label>
            <div class="mt-1 flex flex-wrap gap-2">
              <button
                v-for="tag in selectedTags"
                :key="tag"
                @click="toggleTag(tag)"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
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
      </div>

      <!-- Posts List -->
      <div class="space-y-6">
        <div
          v-for="post in filteredPosts"
          :key="post.id"
          class="bg-white shadow rounded-lg overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <img
                  class="h-10 w-10 rounded-full"
                  :src="post.author.avatar"
                  :alt="post.author.name"
                />
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900">{{ post.title }}</h3>
                  <p class="text-sm text-gray-500">
                    Posted by {{ post.author.name }} • {{ post.date }}
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <button
                  @click="toggleAnonymous(post)"
                  class="text-sm text-gray-500 hover:text-military-blue"
                >
                  {{ post.isAnonymous ? 'Anonymous' : 'Public' }}
                </button>
                <button
                  @click="toggleBookmark(post)"
                  class="text-sm text-gray-500 hover:text-military-blue"
                >
                  {{ post.isBookmarked ? 'Bookmarked' : 'Bookmark' }}
                </button>
              </div>
            </div>
            <div class="mt-4">
              <p class="text-gray-600">{{ post.content }}</p>
            </div>
            <div class="mt-4 flex flex-wrap gap-2">
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {{ tag }}
              </span>
            </div>
            <div class="mt-6 flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <button
                  @click="toggleLike(post)"
                  class="flex items-center text-sm text-gray-500 hover:text-military-blue"
                >
                  <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {{ post.likes }}
                </button>
                <button
                  @click="showComments(post)"
                  class="flex items-center text-sm text-gray-500 hover:text-military-blue"
                >
                  <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {{ post.comments.length }}
                </button>
              </div>
              <button
                @click="showComments(post)"
                class="text-sm text-military-blue hover:text-olive-green"
              >
                View Discussion
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- New Post Modal -->
      <div
        v-if="showNewPostModal"
        class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4"
      >
        <div class="bg-white rounded-lg max-w-2xl w-full p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Create New Post</h3>
          <div class="space-y-4">
            <div>
              <label for="post-title" class="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="post-title"
                v-model="newPost.title"
                class="input-field mt-1"
                placeholder="Enter post title"
              />
            </div>
            <div>
              <label for="post-category" class="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="post-category"
                v-model="newPost.category"
                class="input-field mt-1"
              >
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
            <div>
              <label for="post-content" class="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                id="post-content"
                v-model="newPost.content"
                rows="6"
                class="input-field mt-1"
                placeholder="Write your post content here..."
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Tags</label>
              <div class="mt-1 flex flex-wrap gap-2">
                <button
                  v-for="tag in selectedTags"
                  :key="tag"
                  @click="toggleNewPostTag(tag)"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="[
                    newPost.tags.includes(tag)
                      ? 'bg-military-blue text-white'
                      : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ tag }}
                </button>
              </div>
            </div>
            <div class="flex items-center">
              <input
                id="anonymous"
                v-model="newPost.isAnonymous"
                type="checkbox"
                class="h-4 w-4 text-military-blue focus:ring-military-blue border-gray-300 rounded"
              />
              <label for="anonymous" class="ml-2 block text-sm text-gray-900">
                Post anonymously
              </label>
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button
              @click="showNewPostModal = false"
              class="btn-secondary"
            >
              Cancel
            </button>
            <button
              @click="submitNewPost"
              class="btn-primary"
            >
              Create Post
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { toast } from 'vue3-toastify'

const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('recent')
const activeTags = ref([])
const showNewPostModal = ref(false)

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

const newPost = ref({
  title: '',
  category: '',
  content: '',
  tags: [],
  isAnonymous: false
})

const posts = [
  {
    id: 1,
    title: 'Tips for translating military experience to civilian resume',
    content: 'I\'ve been working on my resume and wanted to share some tips that helped me land interviews...',
    author: {
      name: 'John Smith',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    date: '2 hours ago',
    category: 'Job Search',
    tags: ['Resume Help', 'Career Transition'],
    likes: 24,
    comments: [
      {
        id: 1,
        author: 'Sarah Johnson',
        content: 'Great tips! I would also add...',
        date: '1 hour ago'
      }
    ],
    isAnonymous: false,
    isBookmarked: false
  }
]

const filteredPosts = computed(() => {
  return posts.filter(post => {
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

const toggleLike = (post) => {
  post.likes++
}

const showComments = (post) => {
  // Show comments modal or navigate to post detail page
  console.log('Show comments for post:', post)
}

const submitNewPost = async () => {
  try {
    // Submit new post to backend
    console.log('New post:', newPost.value)
    toast.success('Post created successfully!')
    showNewPostModal.value = false
  } catch (error) {
    toast.error('Failed to create post')
  }
}
</script> 