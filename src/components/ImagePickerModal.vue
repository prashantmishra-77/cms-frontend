<template>
  <!-- BACKDROP -->
  <div class="modal-backdrop" @click.self="$emit('close')">

    <!-- MODAL BOX -->
    <div class="modal-box">

      <!-- HEADER -->
      <div class="modal-header">
        <h2>Select Image</h2>
        <button class="modal-close" @click="$emit('close')">✕</button>
      </div>

      <!-- UPLOAD STRIP -->
      <div class="modal-upload-strip">
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          multiple
          style="display:none"
          @change="handleUpload"
        />
        <button class="btn btn-outline" @click="fileInputRef.click()">
          + Upload New Image
        </button>
        <span class="modal-file-count">{{ mediaStore.totalFiles }} files in library</span>
      </div>

      <!-- SEARCH -->
      <div class="modal-search-wrap">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search images..."
          class="search-input"
        />
      </div>

      <!-- IMAGE GRID -->
      <div class="modal-grid">
        <div
          v-for="file in filteredFiles"
          :key="file.id"
          class="modal-item"
          :class="{ 'modal-item-selected': selectedId === file.id }"
          @click="selectedId = file.id"
        >
          <img :src="file.url" :alt="file.name" />
          <div class="modal-item-check" v-if="selectedId === file.id">✓</div>
          <p class="modal-item-name">{{ file.name }}</p>
        </div>

        <!-- EMPTY -->
        <div class="modal-empty" v-if="filteredFiles.length === 0">
          <p>No images found.</p>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="modal-footer">
        <div class="modal-selected-info" v-if="selectedFile">
          <img :src="selectedFile.url" :alt="selectedFile.name" />
          <div>
            <p class="modal-selected-name">{{ selectedFile.name }}</p>
            <p class="modal-selected-size">{{ mediaStore.formatSize(selectedFile.size) }}</p>
          </div>
        </div>
        <div v-else class="modal-selected-info-empty">
          No image selected
        </div>

        <div style="display:flex; gap:10px;">
          <button class="btn btn-outline" @click="$emit('close')">Cancel</button>
          <button
            class="btn btn-primary"
            :disabled="!selectedId"
            @click="confirmSelection"
          >
            Select Image
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMediaStore } from '../stores/media.js'
import { useToastStore } from '../stores/toast.js'

// ============================================
// PROPS & EMITS
// ============================================

const props = defineProps({
  currentImageUrl: {
    type: String,
    default: null,
  }
})

const emit = defineEmits(['close', 'select'])

// ============================================
// STORES
// ============================================

const mediaStore = useMediaStore()
const toast      = useToastStore()

// ============================================
// STATE
// ============================================

const fileInputRef = ref(null)
const searchQuery  = ref('')

// Pre-select if post already has a featured image
const selectedId = ref(
  props.currentImageUrl
    ? mediaStore.mediaFiles.find(f => f.url === props.currentImageUrl)?.id ?? null
    : null
)

// ============================================
// COMPUTED
// ============================================

const filteredFiles = computed(() => {
  if (!searchQuery.value.trim()) return mediaStore.mediaFiles
  const q = searchQuery.value.toLowerCase()
  return mediaStore.mediaFiles.filter(f => f.name.toLowerCase().includes(q))
})

const selectedFile = computed(() =>
  selectedId.value
    ? mediaStore.mediaFiles.find(f => f.id === selectedId.value)
    : null
)

// ============================================
// FUNCTIONS
// ============================================

function handleUpload(event) {
  const files = Array.from(event.target.files)
  const pending = files.map(file => ({
    name:       file.name,
    size:       file.size,
    type:       file.type,
    previewUrl: URL.createObjectURL(file),
  }))
  mediaStore.addFiles(pending)
  toast.success(`${files.length} image(s) uploaded`)
  event.target.value = ''
}

function confirmSelection() {
  if (!selectedFile.value) return
  emit('select', selectedFile.value)
  emit('close')
}
</script>