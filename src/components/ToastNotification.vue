<template>
  <div class="toast-container">
    <transition-group name="toast">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="toast"
        :class="`toast-${toast.type}`"
        @click="toastStore.remove(toast.id)"
      >
        <span class="toast-icon">{{ icons[toast.type] }}</span>
        <span class="toast-message">{{ toast.message }}</span>
        <button class="toast-close">✕</button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToastStore } from '../stores/toast.js'

const toastStore = useToastStore()

const icons = {
  success: '✅',
  error:   '❌',
  info:    'ℹ️',
  warning: '⚠️',
}
</script>