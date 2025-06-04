import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/auth'
  },
  {
    path: '/auth',
    name: 'Login',
    component: () => import('@/views/AuthView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: () => import('@/views/OnboardingView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mentorship',
    name: 'Mentorship',
    component: () => import('@/views/MentorshipView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/forum',
    name: 'Forum',
    component: () => import('@/views/ForumView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/forum/post/:id',
    name: 'PostDetail',
    component: () => import('@/views/PostDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/chatbot',
    name: 'Chatbot',
    component: () => import('@/views/ChatbotView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/saved-chats',
    name: 'SavedChats',
    component: () => import('@/views/SavedChatsView.vue'),
    meta: { requiresAuth: true }
  },
  // {
  //   path: '/profile/edit',
  //   name: 'EditProfile',
  //   component: () => import('@/views/EditProfileView.vue'),
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: '/profile/documents',
  //   name: 'Documents',
  //   component: () => import('@/views/DocumentsView.vue'),
  //   meta: { requiresAuth: true }
  // },
  {
    path: '/jobs',
    name: 'Jobs',
    component: () => import('@/views/JobsView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/auth')
  } else if (to.path === '/auth' && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router 