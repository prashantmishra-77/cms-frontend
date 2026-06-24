<template>
  <div>

    <div class="page-header">
      <button class="btn btn-outline" @click="goBack">← Back</button>
      <h1>{{ isEditing ? 'Edit Post' : 'New Post' }}</h1>
      <button class="btn btn-primary" @click="savePost">
        {{ isEditing ? 'Update Post' : 'Publish Post' }}
      </button>
    </div>

    <div class="post-edit-layout">

      <!-- LEFT -->
      <div class="post-edit-main">
        <div class="form-box">

          <div class="form-group">
            <label>Title</label>
            <input v-model="form.title" type="text" placeholder="Enter post title" />
          </div>

          <div class="form-group">
            <label>Slug (URL)</label>
            <input v-model="form.slug" type="text" placeholder="post-url-slug" />
            <small class="field-hint">Auto-generated from title.</small>
          </div>

          <div class="form-group">
            <label>Content</label>
            <textarea
              v-model="form.content"
              placeholder="Write your post content here..."
              style="min-height: 260px;"
            ></textarea>
          </div>

          <div class="preview-box" v-if="form.title">
            <p class="preview-label">Live Preview</p>
            <h3 class="preview-title">{{ form.title }}</h3>
            <p class="preview-slug">URL: /blog/{{ form.slug }}</p>
            <p class="preview-content">{{ form.content }}</p>
          </div>

        </div>
      </div>

      <!-- RIGHT -->
      <div class="post-edit-sidebar">

        <div class="post-sidebar-card">
          <h3>Publish</h3>

          <div class="form-group">
            <label>Status</label>
            <select v-model="form.status">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div class="form-group">
            <label>Category</label>
            <select v-model="form.category">
              <option value="">-- Select --</option>
              <option value="technology">Technology</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
              <option value="lifestyle">Lifestyle</option>
            </select>
          </div>

          <button class="btn btn-primary" style="width:100%;" @click="savePost">
            {{ isEditing ? 'Update Post' : 'Publish Post' }}
          </button>
          <button class="btn btn-outline" style="width:100%; margin-top:8px;" @click="goBack">
            Cancel
          </button>
        </div>

        <div class="post-sidebar-card">
          <h3>Featured Image</h3>

          <div class="featured-image-preview" v-if="form.featuredImage">
            <img :src="form.featuredImage" alt="Featured" />
            <div class="featured-image-actions">
              <button class="btn btn-outline" @click="showImagePicker = true">Change</button>
              <button class="btn btn-danger" @click="form.featuredImage = ''">Remove</button>
            </div>
          </div>

          <div class="featured-image-empty" v-else @click="showImagePicker = true">
            <span>🖼️</span>
            <p>Click to set featured image</p>
          </div>
        </div>

      </div>
    </div>

    <ImagePickerModal
      v-if="showImagePicker"
      :current-image-url="form.featuredImage"
      @close="showImagePicker = false"
      @select="handleImageSelect"
    />

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostsStore } from '../stores/posts.js'
import { useToastStore } from '../stores/toast.js'
import ImagePickerModal from '../components/ImagePickerModal.vue'
import { postsApi } from '../services/api.js'

const route   = useRoute()
const router  = useRouter()
const store   = usePostsStore()
const toast   = useToastStore()

const isEditing       = computed(() => !!route.params.id)
const showImagePicker = ref(false)

const form = ref({
  title:         '',
  slug:          '',
  content:       '',
  status:        'draft',
  category:      '',
  featuredImage: '',
})

watch(() => form.value.title, (newTitle) => {
  if (!isEditing.value) {
    form.value.slug = newTitle
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
  }
})

onMounted(async () => {
  if (isEditing.value) {
    const id   = route.params.id
    // First check local store
    let post = store.getPostById(id)

    // If not in store, fetch from API
    if (!post) {
      try {
        post = await postsApi.getById(id)
      } catch (err) {
        toast.error('Post not found')
        router.push('/posts')
        return
      }
    }

    form.value = {
      title:         post.title,
      slug:          post.slug,
      content:       post.content,
      status:        post.status,
      category:      post.category,
      featuredImage: post.featuredImage || '',
    }
  }
})

function handleImageSelect(file) {
  form.value.featuredImage = file.url
  toast.success('Featured image set')
}

async function savePost() {
  if (!form.value.title.trim()) {
    toast.error('Please enter a title')
    return
  }

  try {
    if (isEditing.value) {
      await store.updatePost(route.params.id, form.value)
      toast.success('Post updated successfully')
    } else {
      await store.addPost(form.value)
      toast.success('Post created successfully')
    }
    router.push('/posts')
  } catch (err) {
    toast.error(err.message || 'Something went wrong')
  }
}

function goBack() {
  router.push('/posts')
}
</script>