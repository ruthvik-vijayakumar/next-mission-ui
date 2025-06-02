import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import Toast from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import './assets/main.css'

import App from './App.vue'
import { useAuthStore } from './stores/auth'

// Import views
import AuthView from './views/AuthView.vue'
import OnboardingView from './views/OnboardingView.vue'
import DashboardView from './views/DashboardView.vue'
import MentorshipView from './views/MentorshipView.vue'
import ForumView from './views/ForumView.vue'
import ChatbotView from './views/ChatbotView.vue'
// import ProfileView from './views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'auth',
      component: AuthView,
      meta: { requiresAuth: false }
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: OnboardingView,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/mentorship',
      name: 'mentorship',
      component: MentorshipView,
      meta: { requiresAuth: true }
    },
    {
      path: '/forum',
      name: 'forum',
      component: ForumView,
      meta: { requiresAuth: true }
    },
    {
      path: '/chatbot',
      name: 'chatbot',
      component: ChatbotView,
      meta: { requiresAuth: true }
    },
    // {
    //   path: '/profile',
    //   name: 'profile',
    //   component: ProfileView,
    //   meta: { requiresAuth: true }
    // }
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'auth' })
  } else if (to.name === 'auth' && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(Toast, {
  autoClose: 3000,
  position: 'top-right'
})

app.mount('#app') 