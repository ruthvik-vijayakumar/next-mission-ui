import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Toast from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import './assets/main.css'

import App from './App.vue'
import { useAuthStore } from './stores/auth'
import router from './router'


const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(Toast, {
  autoClose: 3000,
  position: 'top-right'
})

app.mount('#app') 