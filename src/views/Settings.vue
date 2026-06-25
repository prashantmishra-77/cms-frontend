<template>
  <div>
    <div class="page-header">
      <h1>Settings</h1>
      <button class="btn btn-primary" @click="saveSettings">
        Save Changes
      </button>
    </div>

    <!-- SUCCESS MESSAGE -->
    <div class="alert-success" v-if="saved">
      ✅ Settings saved successfully!
    </div>

    <!-- GENERAL SETTINGS -->
    <div class="settings-section">
      <h2><i class="ti ti-adjustments" aria-hidden="true"></i> General</h2>

      <div class="form-group">
        <label>CMS Name</label>
        <input v-model="settings.siteName" type="text" />
      </div>

      <div class="form-group">
        <label>Site URL</label>
        <input v-model="settings.siteUrl" type="text" />
      </div>

      <div class="form-group">
        <label>Tagline</label>
        <input v-model="settings.tagline" type="text" />
      </div>

      <div class="form-group">
        <label>Posts per page</label>
        <select v-model="settings.postsPerPage">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>

    <!-- ACCOUNT SETTINGS -->
    <div class="settings-section">
      <h2><i class="ti ti-user-circle" aria-hidden="true"></i> Account</h2>
      
      <div class="form-group">
        <label>Logged in as</label>
        <input :value="authStore.username" disabled />
      </div>

      <div class="form-group">
        <label>Role</label>
        <input :value="authStore.user?.role" disabled />
      </div>

      <button
        class="btn btn-danger"
        style="margin-top: 8px;"
        @click="handleLogout"
      >
        Logout
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useToastStore } from '../stores/toast.js'
import { useConfirm } from '../composables/useConfirm.js'
import { useLocalStorage } from '../composables/useLocalStorage.js'

const { confirm } = useConfirm()
const toast = useToastStore()

const router    = useRouter()
const authStore = useAuthStore()

const saved = ref(false)

// Load saved settings from localStorage or use defaults
const { value: settings } = useLocalStorage('cms_settings', {
  siteName:     'My CMS',
  siteUrl:      'https://mysite.com',
  tagline:      'A simple content management system',
  postsPerPage: '10',
})

function saveSettings() {
  // useLocalStorage auto-saves on change — just show toast
  toast.success('Settings saved successfully')
}

async function handleLogout() {
  const ok = await confirm({
    title:   'Logout',
    message: 'Are you sure you want to logout?'
  })
  if (!ok) return
  authStore.logout()
  router.push('/login')
}
</script>