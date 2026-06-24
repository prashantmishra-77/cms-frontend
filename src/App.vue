<template>
  <div>

    <ToastNotification />
    <ConfirmDialog />

    <!-- PUBLIC BLOG — no sidebar -->
    <RouterView v-if="isPublicRoute" />

    <!-- CMS — with sidebar -->
    <div class="cms-layout" v-else-if="authStore.isLoggedIn">
      <aside class="sidebar">
        <div class="logo">📝 My CMS</div>
        <nav>
          <RouterLink to="/">Dashboard</RouterLink>
          <RouterLink to="/posts">Blog Posts</RouterLink>
          <RouterLink to="/media">Media</RouterLink>
          <RouterLink to="/settings">Settings</RouterLink>
        </nav>
        <div class="sidebar-user">
          <div class="sidebar-avatar">
            {{ authStore.username.charAt(0) }}
          </div>
          <div class="sidebar-user-info">
            <p class="sidebar-username">{{ authStore.username }}</p>
            <p class="sidebar-role">{{ authStore.user?.role }}</p>
          </div>
          <button class="logout-btn" @click="handleLogout" title="Logout">✕</button>
        </div>
      </aside>
      <main class="content">
        <RouterView />
      </main>
    </div>

    <!-- LOGIN PAGE -->
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

const isPublicRoute = computed(() =>
  route.path.startsWith('/blog')
)

async function handleLogout() {
  const ok = await confirm({
    title:   'Logout',
    message: 'Are you sure you want to logout?'
  })
  if (!ok) return
  authStore.logout()
  toast.success('Logged out successfully')
  router.push('/login')
}
</script>