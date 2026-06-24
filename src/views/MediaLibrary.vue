<template>
  <div>

    <!-- PAGE HEADER -->
    <div class="page-header">
      <h1>Media Library</h1>
      <button class="btn btn-primary" @click="triggerUpload">
        + Upload Images
      </button>
    </div>

    <!-- HIDDEN FILE INPUT -->
    <!-- We hide this and trigger it from the button above -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      multiple
      style="display: none"
      @change="handleFileUpload"
    />

    <!-- STATS BAR -->
    <div class="media-stats">
      <span>{{ store.totalFiles }} files</span>
      <span>Total size: {{ store.totalSize }}</span>
    </div>

    <!-- UPLOAD PREVIEW AREA -->
    <!-- Shows files selected but not yet confirmed -->
    <div class="upload-preview" v-if="pendingFiles.length > 0">
      <div class="upload-preview-header">
        <p>{{ pendingFiles.length }} image(s) ready to upload</p>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-primary" @click="confirmUpload">
            Confirm Upload
          </button>
          <button class="btn btn-outline" @click="cancelUpload">
            Cancel
          </button>
        </div>
      </div>

      <div class="pending-grid">
        <div
          class="pending-item"
          v-for="file in pendingFiles"
          :key="file.name"
        >
          <img :src="file.previewUrl" :alt="file.name" />
          <p class="pending-name">{{ file.name }}</p>
          <p class="pending-size">{{ store.formatSize(file.size) }}</p>
        </div>
      </div>
    </div>

    <!-- MEDIA GRID -->
    <div class="media-layout">

      <!-- IMAGE GRID -->
      <div class="media-grid">
        <div
          class="media-item"
          v-for="file in store.mediaFiles"
          :key="file.id"
          @click="store.selectFile(file)"
          :class="{ 'media-item-selected': store.selectedFile?._id === file._id }"
        >
          <div class="media-thumb">
            <img :src="file.url" :alt="file.name" />
          </div>
          <p class="media-name">{{ file.name }}</p>
        </div>

        <!-- EMPTY STATE -->
        <div class="empty-state" v-if="store.mediaFiles.length === 0">
          <p>No media yet. Click <strong>+ Upload Images</strong> to add some.</p>
        </div>
      </div>

      <!-- DETAIL PANEL — shows when an image is selected -->
      <div class="media-detail" v-if="store.selectedFile">
        <div class="detail-preview">
          <img
            :src="store.selectedFile.url"
            :alt="store.selectedFile.name"
          />
        </div>

        <div class="detail-info">
          <h3>{{ store.selectedFile.name }}</h3>

          <table class="detail-table">
          <tbody>
            <tr>
              <td>Type</td>
              <td>{{ store.selectedFile.type }}</td>
            </tr>
            <tr>
              <td>Size</td>
              <td>{{ store.formatSize(store.selectedFile.size) }}</td>
            </tr>
            <tr>
              <td>Uploaded</td>
              <td>{{ store.selectedFile.date }}</td>
            </tr>
            </tbody>
          </table>

          <!-- Copy URL button -->
          <button class="btn btn-outline" style="width:100%; margin-top:12px;" @click="copyUrl">
            📋 Copy URL
          </button>

          <!-- Delete button -->
          <button
            class="btn btn-danger"
            style="width:100%; margin-top:8px;"
            @click="handleDelete(store.selectedFile._id)"
          >
            🗑 Delete Image
          </button>

          <!-- Close panel -->
          <button
            class="btn btn-outline"
            style="width:100%; margin-top:8px;"
            @click="store.clearSelection"
          >
            Close
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMediaStore } from '../stores/media.js'
import { useToastStore } from '../stores/toast.js'
import { useConfirm } from '../composables/useConfirm.js'
const { confirm } = useConfirm()
const toast = useToastStore()

const store = useMediaStore()

// ============================================
// FILE INPUT REF
// ============================================

// ref on a DOM element — gives us direct access to the input element
const fileInputRef = ref(null)

// Pending files = selected but not yet uploaded
const pendingFiles = ref([])

// ============================================
// UPLOAD FUNCTIONS
// ============================================

// Trigger the hidden file input click
function triggerUpload() {
  fileInputRef.value.click()
}

// Runs when user selects files from file picker
function handleFileUpload(event) {
  const selected = Array.from(event.target.files)  // FileList → Array

  // For each file, create a preview URL
  pendingFiles.value = selected.map(file => ({
    name:       file.name,
    size:       file.size,
    type:       file.type,
    previewUrl: URL.createObjectURL(file),  // temporary browser URL for preview
    rawFile:    file,                        // keep original file object
  }))

  // Reset file input so same file can be selected again
  event.target.value = ''
}

// User confirms — add to store
async function confirmUpload() {
  try {
    for (const file of pendingFiles.value) {
      if (file.rawFile) {
        // Real file — upload to server
        await store.uploadFile(file)
      }
    }
    toast.success(`${pendingFiles.value.length} image(s) uploaded`)
    pendingFiles.value = []
  } catch (err) {
    toast.error('Upload failed: ' + err.message)
  }
}


// User cancels — discard pending files
function cancelUpload() {
  // Revoke object URLs to free memory
  pendingFiles.value.forEach(f => URL.revokeObjectURL(f.previewUrl))
  pendingFiles.value = []
}

// ============================================
// OTHER ACTIONS
// ============================================

async function handleDelete(id) {
  const ok = await confirm({
    title:   'Delete Image',
    message: 'This will permanently remove the image. Continue?'
  })
  if (!ok) return
  store.deleteFile(id)
  toast.success('Image deleted')
}

function copyUrl() {
  navigator.clipboard.writeText(store.selectedFile.url)
  toast.info('URL copied to clipboard')
}
</script>