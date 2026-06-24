import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMediaStore = defineStore('media', () => {

  // ============================================
  // STATE
  // ============================================

  const mediaFiles = ref([
    {
      id: 1,
      name: 'hero-banner.jpg',
      url: 'https://picsum.photos/seed/hero/800/600',
      size: 124000,
      type: 'image/jpeg',
      date: '2026-06-01',
    },
    {
      id: 2,
      name: 'about-photo.jpg',
      url: 'https://picsum.photos/seed/about/800/600',
      size: 98000,
      type: 'image/jpeg',
      date: '2026-06-05',
    },
    {
      id: 3,
      name: 'blog-cover.jpg',
      url: 'https://picsum.photos/seed/blog/800/600',
      size: 210000,
      type: 'image/jpeg',
      date: '2026-06-10',
    },
    {
      id: 4,
      name: 'team-photo.jpg',
      url: 'https://picsum.photos/seed/team/800/600',
      size: 176000,
      type: 'image/jpeg',
      date: '2026-06-15',
    },
  ])

  // Which image is currently selected (for detail view)
  const selectedFile = ref(null)

  // ============================================
  // GETTERS
  // ============================================

  const totalFiles = computed(() => mediaFiles.value.length)

  const totalSize = computed(() => {
    const bytes = mediaFiles.value.reduce((sum, f) => sum + f.size, 0)
    return formatSize(bytes)
  })

  // ============================================
  // ACTIONS
  // ============================================

  // Add multiple files at once (from file input)
  function addFiles(files) {
    files.forEach(file => {
      mediaFiles.value.push({
        id: Date.now() + Math.random(),   // unique id
        name: file.name,
        url: file.previewUrl,             // temporary preview URL
        size: file.size,
        type: file.type,
        date: new Date().toISOString().split('T')[0],
      })
    })
  }

  async function deleteFile(id) {
    loading.value = true
    try {
      await mediaApi.delete(id)
      mediaFiles.value = mediaFiles.value.filter(f => f._id !== id)
      if (selectedFile.value?._id === id) selectedFile.value = null
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  function selectFile(file) {
    selectedFile.value = file
  }

  function clearSelection() {
    selectedFile.value = null
  }

  async function uploadFile(file) {
    loading.value = true
    try {
      const saved = await mediaApi.upload(file)
      mediaFiles.value.unshift(saved)   // add to beginning of list
      return saved
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  // ============================================
  // HELPERS
  // ============================================

  function formatSize(bytes) {
    if (bytes < 1024)        return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return {
    mediaFiles,
    selectedFile,
    totalFiles,
    totalSize,
    addFiles,
    deleteFile,
    selectFile,
    clearSelection,
    formatSize,
  }
})