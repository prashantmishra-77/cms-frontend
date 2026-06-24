import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {

  // ============================================
  // STATE
  // ============================================

  // Check localStorage on startup — if user was logged in before, restore it
  const user = ref(JSON.parse(localStorage.getItem('cms_user')) || null)

  // ============================================
  // GETTERS
  // ============================================

  const isLoggedIn = computed(() => !!user.value)

  const username = computed(() => user.value?.name || '')

  // ============================================
  // ACTIONS
  // ============================================

  function login(credentials) {
    // In a real app — you'd call an API here
    // For now we hardcode valid users
    const validUsers = [
      { name: 'Prashant', email: 'prashant@cms.com', password: 'admin123', role: 'admin' },
      { name: 'Editor',   email: 'editor@cms.com',   password: 'edit123',  role: 'editor' },
    ]

    const match = validUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    )

    if (match) {
      // Save user (without password) to state and localStorage
      const userData = { name: match.name, email: match.email, role: match.role }
      user.value = userData
      localStorage.setItem('cms_user', JSON.stringify(userData))
      return { success: true }
    }

    return { success: false, message: 'Invalid email or password' }
  }

  function logout() {
    user.value = null
    localStorage.removeItem('cms_user')
  }

  return {
    user,
    isLoggedIn,
    username,
    login,
    logout,
  }
})