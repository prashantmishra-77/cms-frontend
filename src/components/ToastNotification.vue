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
        <i class="ti" :class="icons[toast.type]" aria-hidden="true"></i>
        <span class="toast-message">{{ toast.message }}</span>
        <button class="toast-close" aria-label="Close">
          <i class="ti ti-x" aria-hidden="true"></i>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToastStore } from '../stores/toast.js'

const toastStore = useToastStore()

const icons = {
  success: 'ti-circle-check',
  error:   'ti-alert-circle',
  info:    'ti-info-circle',
  warning: 'ti-alert-triangle',
}
</script>