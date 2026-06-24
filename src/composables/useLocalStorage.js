// Composable — syncs a ref to localStorage automatically
// Usage: const theme = useLocalStorage('theme', 'light')

import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {

  // Try to read existing value from localStorage
  const stored = localStorage.getItem(key)
  const initial = stored ? JSON.parse(stored) : defaultValue

  // Create a reactive ref with the stored/default value
  const value = ref(initial)

  // Watch for changes and save to localStorage automatically
  watch(value, (newVal) => {
    localStorage.setItem(key, JSON.stringify(newVal))
  }, { deep: true })

  // Helper to clear this key
  function clear() {
    localStorage.removeItem(key)
    value.value = defaultValue
  }

  return { value, clear }
}