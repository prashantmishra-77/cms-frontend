<template>
  <div class="public-layout">

    <header class="public-header">
      <div class="public-header-inner">
        <RouterLink to="/blog" class="public-logo">📝 My Blog</RouterLink>
        <nav class="public-nav">
          <RouterLink to="/blog">Home</RouterLink>
          <a href="/">Admin ↗</a>
        </nav>
      </div>
    </header>

    <section class="blog-hero">
      <h1>Welcome to My Blog</h1>
      <p>Thoughts on technology, design, business and lifestyle.</p>
    </section>

    <div class="public-container">

      <!-- LOADING -->
      <div class="loading-state" v-if="loading">
        <div class="loading-spinner"></div>
        <p>Loading posts...</p>
      </div>

      <div v-else>
        <div class="blog-tabs">
          <button class="blog-tab" :class="{ 'blog-tab-active': activeCategory === 'all' }"
            @click="activeCategory = 'all'">
            <i class="ti ti-layout-grid" aria-hidden="true"></i> All
          </button>
          <button v-for="cat in categories" :key="cat"
            class="blog-tab"
            :class="{ 'blog-tab-active': activeCategory === cat }"
            @click="activeCategory = cat">
            {{ cat }}
          </button>
        </div>

        <p class="public-post-count">
          {{ filteredPosts.length }} post{{ filteredPosts.length !== 1 ? 's' : '' }}
        </p>

        <div class="blog-grid" v-if="filteredPosts.length > 0">
          <RouterLink
            v-for="post in filteredPosts"
            :key="post._id"
            :to="`/blog/${post.slug}`"
            class="blog-card"
          >
            <div class="blog-card-cover" :class="`cover-${post.category || 'default'}`">
              <span class="cover-category">
                <i class="ti" :class="{
                  'ti-cpu':      post.category === 'technology',
                  'ti-palette':  post.category === 'design',
                  'ti-briefcase':post.category === 'business',
                  'ti-heart':    post.category === 'lifestyle',
                  'ti-tag':      !post.category,
                }" aria-hidden="true"></i>
                {{ post.category || 'general' }}
              </span>
            </div>
            <div class="blog-card-body">
              <h2 class="blog-card-title">{{ post.title }}</h2>
              <p class="blog-card-excerpt">{{ excerpt(post.content) }}</p>
              <div class="blog-card-meta">
                <span class="blog-card-date">
                  <i class="ti ti-calendar" aria-hidden="true"></i>
                  {{ formatDate(post.createdAt) }}
                </span>
                <span class="blog-read-more">
                  Read more <i class="ti ti-arrow-right" aria-hidden="true"></i>
                </span>
              </div>
            </div>
          </RouterLink>
        </div>

        <div class="public-empty" v-else>
          <p>No posts in this category yet.</p>
        </div>
      </div>

    </div>

    <footer class="public-footer">
      <p>© 2026 My Blog. Built with Vue.js</p>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { postsApi } from '../../services/api.js'
import { useFormatDate } from '../../composables/useFormatDate.js'

const { formatDate } = useFormatDate()

const posts          = ref([])
const loading        = ref(true)
const activeCategory = ref('all')

onMounted(async () => {
  try {
    posts.value = await postsApi.getAll({ status: 'published' })
  } catch (err) {
    console.error('Failed to load posts:', err)
  } finally {
    loading.value = false
  }
})

const categories = computed(() => {
  const cats = posts.value.map(p => p.category).filter(Boolean)
  return [...new Set(cats)]
})

const filteredPosts = computed(() => {
  if (activeCategory.value === 'all') return posts.value
  return posts.value.filter(p => p.category === activeCategory.value)
})

function excerpt(content, length = 120) {
  if (!content) return ''
  const plain = content.replace(/<[^>]*>/g, '')
  return plain.length > length ? plain.slice(0, length) + '...' : plain
}
</script>