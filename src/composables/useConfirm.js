// Composable — replaces window.confirm() with a reactive modal
// Usage: const { confirm, ConfirmDialog } = useConfirm()

import { ref, h, defineComponent } from 'vue'

// Global state — shared across all components
const isOpen   = ref(false)
const message  = ref('')
const title    = ref('')
let   resolver = null   // holds the resolve function of the Promise

export function useConfirm() {

  // Call this instead of window.confirm()
  // Returns a Promise that resolves to true (confirmed) or false (cancelled)
  function confirm(options = {}) {
    title.value   = options.title   || 'Are you sure?'
    message.value = options.message || 'This action cannot be undone.'
    isOpen.value  = true

    return new Promise((resolve) => {
      resolver = resolve
    })
  }

  function onConfirm() {
    isOpen.value = false
    resolver?.(true)
  }

  function onCancel() {
    isOpen.value = false
    resolver?.(false)
  }

  // The dialog component — rendered in App.vue once
  const ConfirmDialog = defineComponent({
    setup() {
      return () => isOpen.value ? h('div', {
        class: 'confirm-backdrop',
        onClick: onCancel,
      }, [
        h('div', {
          class: 'confirm-box',
          onClick: (e) => e.stopPropagation(),
        }, [
          h('div', { class: 'confirm-icon' }, '⚠️'),
          h('h3', { class: 'confirm-title' }, title.value),
          h('p',  { class: 'confirm-message' }, message.value),
          h('div', { class: 'confirm-actions' }, [
            h('button', {
              class: 'btn btn-outline',
              onClick: onCancel,
            }, 'Cancel'),
            h('button', {
              class: 'btn btn-danger',
              onClick: onConfirm,
            }, 'Confirm'),
          ]),
        ]),
      ]) : null
    }
  })

  return { confirm, ConfirmDialog, isOpen }
}