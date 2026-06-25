<template>
  <div class="public-layout">

    <header class="public-header">
  <div class="public-header-inner">
    <RouterLink to="/blog" class="public-logo">
      <div class="public-logo-icon">
        <i class="ti ti-pencil" aria-hidden="true"></i>
      </div>
      My Blog
    </RouterLink>
    <nav class="public-nav">
      <RouterLink to="/blog">
        <i class="ti ti-home" aria-hidden="true"></i> Home
      </RouterLink>
      <a href="/">
        Admin <i class="ti ti-external-link" aria-hidden="true"></i>
      </a>
    </nav>
  </div>
</header>

    <!-- LOADING -->
    <div class="public-container" v-if="loading">
      <div class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading post...</p>
      </div>
    </div>

    <!-- NOT FOUND -->
    <div class="public-container" v-else-if="notFound || !post">
      <div class="public-empty" style="margin-top: 60px;">
        <p style="font-size: 48px;">404</p>
        <p>Post not found.</p>
        <RouterLink to="/blog" class="btn btn-primary" style="margin-top:16px; display:inline-flex;">
          ← Back to Blog
        </RouterLink>
      </div>
    </div>

    <!-- POST CONTENT -->
    <div v-else>

      <div class="post-hero" :class="`cover-${post.category || 'default'}`">
        <div class="post-hero-inner">
          <span class="post-hero-category">{{ post.category || 'general' }}</span>
          <h1 class="post-hero-title">{{ post.title }}</h1>
          <p class="post-hero-date">{{ formatDate(post.createdAt) }}</p>
        </div>
      </div>

      <div class="public-container">
        <div class="post-body-wrap">

          <RouterLink to="/blog" class="post-back">
              <i class="ti ti-arrow-left" aria-hidden="true"></i> Back to all posts
            </RouterLink>

            <p class="post-hero-date">
              <i class="ti ti-calendar" aria-hidden="true"></i>
              {{ formatDate(post.createdAt) }}
            </p>
          <div class="post-content" v-html="post.content"></div>

          <div class="post-footer">
            <span class="badge badge-published" v-if="post.status === 'published'">Published</span>
            <RouterLink :to="`/posts/edit/${post._id}`" class="btn btn-outline" style="font-size:13px;">
              ✏️ Edit in CMS
            </RouterLink>
          </div>

          <div class="related-posts" v-if="relatedPosts.length > 0">
            <h3>Related posts</h3>
            <div class="related-grid">
              <RouterLink
                v-for="related in relatedPosts"
                :key="related._id"
                :to="`/blog/${related.slug}`"
                class="related-card"
              >
                <div class="related-cover" :class="`cover-${related.category || 'default'}`"></div>
                <div class="related-info">
                  <p class="related-title">{{ related.title }}</p>
                  <p class="related-date">{{ formatDate(related.createdAt) }}</p>
                </div>
              </RouterLink>
            </div>
          </div>

        </div>
      </div>
    </div>

    <footer class="public-footer">
      <p>© 2026 My Blog. Built with Vue.js</p>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { postsApi } from '../../services/api.js'
import { useFormatDate } from '../../composables/useFormatDate.js'

const route          = useRoute()
const { formatDate } = useFormatDate()

const post         = ref(null)
const relatedPosts = ref([])
const loading      = ref(true)
const notFound     = ref(false)

onMounted(async () => {
  const slug = route.params.slug

  if (!slug) {
    notFound.value = true
    loading.value  = false
    return
  }

  try {
    post.value = await postsApi.getBySlug(slug)

    if (post.value) {
      const all = await postsApi.getAll({
        status:   'published',
        category: post.value.category,
      })
      relatedPosts.value = all
        .filter(p => p._id !== post.value._id)
        .slice(0, 3)
    }
  } catch (err) {
    notFound.value = true
  } finally {
    loading.value = false
  }
})
</script>