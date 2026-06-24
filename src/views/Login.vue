<template>
  <div class="login-page">
    <div class="login-card">

      <!-- LOGO -->
      <div class="login-logo">📝 My CMS</div>
      <h1 class="login-title">Welcome back</h1>
      <p class="login-subtitle">Sign in to your CMS account</p>

      <!-- ERROR MESSAGE -->
      <div class="login-error" v-if="errorMessage">
        {{ errorMessage }}
      </div>

      <!-- LOGIN FORM -->
      <div class="form-group">
        <label>Email</label>
        <input
          v-model="form.email"
          type="email"
          placeholder="prashant@cms.com"
          @keyup.enter="handleLogin"
        />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Enter your password"
          @keyup.enter="handleLogin"
        />
        <small
          class="field-hint"
          style="cursor:pointer; color:#5c5ce0;"
          @click="showPassword = !showPassword"
        >
          {{ showPassword ? 'Hide' : 'Show' }} password
        </small>
      </div>

      <!-- SUBMIT BUTTON -->
      <button
        class="btn btn-primary login-btn"
        @click="handleLogin"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Signing in...' : 'Sign In' }}
      </button>

      <!-- HINT -->
      <div class="login-hint">
        <!-- <p>Demo credentials:</p>
        <p>📧 prashant@cms.com / 🔑 admin123</p>
        <p>📧 editor@cms.com / 🔑 edit123</p> -->
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useToastStore } from '../stores/toast.js'
const toast = useToastStore()
const router      = useRouter()
const authStore   = useAuthStore()

// Form state
const form = ref({
  email:    '',
  password: '',
})

const errorMessage = ref('')
const isLoading    = ref(false)
const showPassword = ref(false)

async function handleLogin() {
  // Basic validation
  if (!form.value.email || !form.value.password) {
    errorMessage.value = 'Please enter email and password'
    return
  }

  isLoading.value    = true
  errorMessage.value = ''

  // Simulate API delay (in real app this would be an actual API call)
  await new Promise(resolve => setTimeout(resolve, 800))

  const result = authStore.login(form.value)

 if (result.success) {
  toast.success(`Welcome back, ${form.value.email.split('@')[0]}!`)
  router.push('/')
} else {
  toast.error(result.message)
  errorMessage.value = result.message
}

  isLoading.value = false
}
</script>