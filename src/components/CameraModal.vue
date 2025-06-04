<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-4 max-w-lg w-full mx-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Take a Photo</h3>
        <button @click="closeCamera" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Camera View -->
      <div class="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
        <video 
          ref="videoRef" 
          class="w-full h-full object-cover"
          autoplay 
          playsinline
        ></video>
        <div v-if="!isCameraReady" class="absolute inset-0 flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-military-blue"></div>
        </div>
      </div>

      <!-- Camera Controls -->
      <div class="flex justify-center space-x-4">
        <button 
          @click="switchCamera" 
          class="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          :disabled="!isCameraReady"
        >
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <button 
          @click="takePhoto" 
          class="p-4 rounded-full bg-military-blue hover:bg-military-blue/90"
          :disabled="!isCameraReady"
        >
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'photo-taken'])

const videoRef = ref(null)
const isCameraReady = ref(false)
const stream = ref(null)
const facingMode = ref('environment')

const openCamera = async () => {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { 
        facingMode: facingMode.value,
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    })
    if (videoRef.value) {
      videoRef.value.srcObject = stream.value
      videoRef.value.onloadedmetadata = () => {
        isCameraReady.value = true
      }
    }
  } catch (error) {
    console.error('Error accessing camera:', error)
    emit('close')
  }
}

const closeCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
  isCameraReady.value = false
  emit('close')
}

const switchCamera = async () => {
  facingMode.value = facingMode.value === 'environment' ? 'user' : 'environment'
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
  }
  await openCamera()
}

const takePhoto = () => {
  if (!videoRef.value) return

  const canvas = document.createElement('canvas')
  canvas.width = videoRef.value.videoWidth
  canvas.height = videoRef.value.videoHeight
  const ctx = canvas.getContext('2d')
  
  ctx.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height)
  
  canvas.toBlob((blob) => {
    if (blob) {
      const file = new File([blob], `photo_${Date.now()}.jpg`, {
        type: 'image/jpeg',
        lastModified: Date.now()
      })
      emit('photo-taken', file)
      closeCamera()
    }
  }, 'image/jpeg', 0.95)
}

// Watch for show prop changes
watch(() => props.show, (newValue) => {
  if (newValue) {
    openCamera()
  } else {
    closeCamera()
  }
})

onUnmounted(() => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
  }
})
</script>

<style scoped>
.aspect-video {
  aspect-ratio: 16 / 9;
}
</style> 