<template>
  <div>
    <ToastNotification />
    <ConfirmDialog />

    <RouterView v-if="isPublicRoute" />

    <div class="cms-layout" v-else-if="authStore.isLoggedIn">
      <aside class="sidebar">
        <div class="sidebar-brand">
          <div class="brand-icon">
            <i class="ti ti-pencil" aria-hidden="true"></i>
          </div>
          <span class="brand-name">My CMS</span>
        </div>

        <nav class="sidebar-nav">
          <RouterLink to="/" class="nav-item">
            <i class="ti ti-layout-dashboard" aria-hidden="true"></i>
            <span>Dashboard</span>
          </RouterLink>
          <RouterLink to="/posts" class="nav-item">
            <i class="ti ti-article" aria-hidden="true"></i>
            <span>Blog Posts</span>
          </RouterLink>
          <RouterLink to="/media" class="nav-item">
            <i class="ti ti-photo" aria-hidden="true"></i>
            <span>Media</span>
          </RouterLink>
          <RouterLink to="/settings" class="nav-item">
            <i class="ti ti-settings" aria-hidden="true"></i>
            <span>Settings</span>
          </RouterLink>
        </nav>

        <div class="sidebar-user">
          <div class="sidebar-avatar">
            {{ authStore.username.charAt(0) }}
          </div>
          <div class="sidebar-user-info">
            <p class="sidebar-username">{{ authStore.username }}</p>
            <p class="sidebar-role">{{ authStore.user?.role }}</p>
          </div>
          <button class="logout-btn" @click="handleLogout" aria-label="Logout">
            <i class="ti ti-logout" aria-hidden="true"></i>
          </button>
        </div>
      </aside>

      <main class="content">
        <RouterView />
      </main>
    </div>

    <RouterView v-else />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore  } from './stores/auth.js'
import { useToastStore } from './stores/toast.js'
import { useConfirm   } from './composables/useConfirm.js'
import ToastNotification from './components/ToastNotification.vue'

const route     = useRoute()
const router    = useRouter()
const authStore = useAuthStore()
const toast     = useToastStore()
const { ConfirmDialog, confirm } = useConfirm()

const isPublicRoute = computed(() => route.path.startsWith('/blog'))

async function handleLogout() {
  const ok = await confirm({ title: 'Logout', message: 'Are you sure you want to logout?' })
  if (!ok) return
  authStore.logout()
  toast.success('Logged out successfully')
  router.push('/login')
}
</script>