import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

import Dashboard    from '../views/Dashboard.vue'
import BlogPosts    from '../views/BlogPosts.vue'
import PostEdit     from '../views/PostEdit.vue'
import MediaLibrary from '../views/MediaLibrary.vue'
import Settings     from '../views/Settings.vue'
import Login        from '../views/Login.vue'
import BlogHome from '../views/public/BlogHome.vue'
import BlogPost from '../views/public/BlogPost.vue'

const routes = [
  // Public route — no auth needed
  { path: '/login', component: Login, meta: { public: true } },

  // Protected routes — must be logged in
  { path: '/',               component: Dashboard,    meta: { requiresAuth: true } },
  { path: '/posts',          component: BlogPosts,    meta: { requiresAuth: true } },
  { path: '/posts/new',      component: PostEdit,     meta: { requiresAuth: true } },
  { path: '/posts/edit/:id', component: PostEdit,     meta: { requiresAuth: true } },
  { path: '/media',          component: MediaLibrary, meta: { requiresAuth: true } },
  { path: '/settings',       component: Settings,     meta: { requiresAuth: true } },
  { path: '/blog',       component: BlogHome, meta: { public: true } },
  { path: '/blog/:slug', component: BlogPost, meta: { public: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ============================================
// NAVIGATION GUARD
// ============================================

router.beforeEach((to, from) => {
    const authStore = useAuthStore()
  
    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
      return '/login'
    }
  
    if (to.path === '/login' && authStore.isLoggedIn) {
      return '/'
    }
  
    // Public routes always allowed
    if (to.meta.public) return
  })

export default router