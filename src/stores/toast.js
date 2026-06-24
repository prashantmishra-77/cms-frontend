import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {

  const toasts = ref([])

  // Add a new toast
  function show(message, type = 'success', duration = 3000) {
    const id = Date.now()

    toasts.value.push({ id, message, type })

    // Auto remove after duration
    setTimeout(() => {
      remove(id)
    }, duration)
  }

  // Shortcut methods
  function success(message) { show(message, 'success') }
  function error(message)   { show(message, 'error')   }
  function info(message)    { show(message, 'info')    }
  function warning(message) { show(message, 'warning') }

  function remove(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { toasts, success, error, info, warning, remove }
})