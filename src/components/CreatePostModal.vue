<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-white z-50 overflow-y-auto"
  >
    <div class="min-h-screen">
      <!-- Modal Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Create New Post</h3>
          <button
            @click="$emit('update:modelValue', false)"
            class="text-gray-400 hover:text-gray-500"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Modal Content -->
      <div class="px-4 py-6 mb-16 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto space-y-6">
          <div>
            <label for="post-title" class="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="post-title"
              v-model="post.title"
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
              v-model="post.category"
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
              v-model="post.content"
              rows="4"
              class="input-field mt-1 min-h-[100px] resize-none overflow-hidden"
              placeholder="Write your post content here..."
              @input="autoResizeTextarea"
            ></textarea>
          </div>

          <!-- Image Upload Section -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Images
            </label>
            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div class="space-y-1 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <div class="flex text-sm text-gray-600">
                  <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-military-blue hover:text-military-blue-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-military-blue">
                    <span>Upload images</span>
                    <input
                      id="file-upload"
                      type="file"
                      class="sr-only"
                      multiple
                      accept="image/*"
                      @change="handleImageUpload"
                    >
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB each
                </p>
              </div>
            </div>

            <!-- Image Previews -->
            <div v-if="post.images.length > 0" class="mt-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              <div
                v-for="(image, index) in post.images"
                :key="index"
                class="relative aspect-square group w-20"
              >
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg"></div>
                <img
                  :src="image.preview"
                  class="w-full h-full object-cover rounded-lg"
                  alt="Preview"
                />
                <button
                  @click="removeImage(index)"
                  class="absolute -top-1 -right-1 p-1 bg-gray-800 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-900 shadow-sm"
                  title="Remove image"
                >
                  <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Tags</label>
            <div class="mt-2 flex flex-wrap gap-2">
              <button
                v-for="tag in selectedTags"
                :key="tag"
                @click="toggleTag(tag)"
                class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium"
                :class="[
                  post.tags.includes(tag)
                    ? 'bg-military-blue text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                ]"
              >
                {{ tag }}
              </button>
            </div>
          </div>
          <div class="flex items-center">
            <input
              id="anonymous"
              v-model="post.isAnonymous"
              type="checkbox"
              class="h-4 w-4 text-military-blue focus:ring-military-blue border-gray-300 rounded"
            />
            <label for="anonymous" class="ml-2 block text-sm text-gray-900">
              Post anonymously
            </label>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto flex justify-end space-x-3">
          <button
            @click="$emit('update:modelValue', false)"
            class="btn-secondary"
          >
            Cancel
          </button>
          <button
            @click="submitPost"
            class="btn-primary"
          >
            Create Post
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { toast } from 'vue3-toastify'
import { useForumStore } from '@/stores/forum'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const forumStore = useForumStore()

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

const post = ref({
  title: '',
  category: '',
  content: '',
  tags: [],
  isAnonymous: false,
  images: []
})

// Reset form when modal is closed
watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    post.value = {
      title: '',
      category: '',
      content: '',
      tags: [],
      isAnonymous: false,
      images: []
    }
  }
})

const toggleTag = (tag) => {
  const index = post.value.tags.indexOf(tag)
  if (index === -1) {
    post.value.tags.push(tag)
  } else {
    post.value.tags.splice(index, 1)
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
      post.value.images.push({
        file,
        preview: e.target.result
      })
    }
    reader.readAsDataURL(file)
  })
}

const removeImage = (index) => {
  post.value.images.splice(index, 1)
}

const autoResizeTextarea = (event) => {
  const textarea = event.target
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}

const submitPost = async () => {
  try {
    const formData = new FormData()
    // formData.append('title', post.value.title)
    // formData.append('category', post.value.category)
    formData.append('content', post.value.content)
    // formData.append('isAnonymous', post.value.isAnonymous)
    // post.value.tags.forEach(tag => formData.append('tags[]', tag))
    formData.append('image', post.value.images[0].file)

    await forumStore.createPost(formData)
    toast.success('Post created successfully!')
    emit('update:modelValue', false)
  } catch (error) {
    toast.error(error || 'Failed to create post')
  }
}
</script> 