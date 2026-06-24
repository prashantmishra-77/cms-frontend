<template>
  <div class="public-layout">

    <!-- PUBLIC HEADER -->
    <header class="public-header">
      <div class="public-header-inner">
        <a href="/blog" class="public-logo">📝 My Blog</a>
        <nav class="public-nav">
          <a href="/blog">Home</a>
          <a href="/">Admin ↗</a>
        </nav>
      </div>
    </header>

    <!-- HERO -->
    <section class="blog-hero">
      <h1>Welcome to My Blog</h1>
      <p>Thoughts on technology, design, business and lifestyle.</p>
    </section>

    <!-- FILTER TABS -->
    <div class="public-container">
      <div class="blog-tabs">
        <button
          class="blog-tab"
          :class="{ 'blog-tab-active': activeCategory === 'all' }"
          @click="activeCategory = 'all'"
        >
          All
        </button>
        <button
          v-for="cat in categories"
          :key="cat"
          class="blog-tab"
          :class="{ 'blog-tab-active': activeCategory === cat }"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <!-- POST COUNT -->
      <p class="public-post-count">
        {{ filteredPosts.length }} post{{ filteredPosts.length !== 1 ? 's' : '' }}
      </p>

      <!-- POSTS GRID -->
      <div class="blog-grid" v-if="filteredPosts.length > 0">
        <RouterLink
          v-for="post in filteredPosts"
          :key="post.id"
          :to="`/blog/${post.slug}`"
          class="blog-card"
        >
          <!-- FAKE COVER IMAGE using post category color -->
          <div class="blog-card-cover" :class="`cover-${post.category || 'default'}`">
            <span class="cover-category">{{ post.category || 'general' }}</span>
          </div>

          <div class="blog-card-body">
            <h2 class="blog-card-title">{{ post.title }}</h2>
            <p class="blog-card-excerpt">{{ excerpt(post.content) }}</p>
            <div class="blog-card-meta">
              <span class="blog-card-date">{{ formatDate(post.date) }}</span>
              <span class="blog-read-more">Read more →</span>
            </div>
          </div>
        </RouterLink>
      </div>

      <!-- EMPTY -->
      <div class="public-empty" v-else>
        <p>No posts in this category yet.</p>
      </div>

    </div>

    <!-- PUBLIC FOOTER -->
    <footer class="public-footer">
      <p>© 2026 My Blog. Built with Vue.js</p>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePostsStore } from '../../stores/posts.js'
import { useFormatDate } from '../../composables/useFormatDate.js'

const { formatDate } = useFormatDate()
const store = usePostsStore()

const activeCategory = ref('all')

// Only show published posts to public
const publishedPosts = computed(() =>
  store.posts.filter(p => p.status === 'published')
)

// Unique categories from published posts
const categories = computed(() => {
  const cats = publishedPosts.value
    .map(p => p.category)
    .filter(Boolean)
  return [...new Set(cats)]
})

// Filter by active category
const filteredPosts = computed(() => {
  if (activeCategory.value === 'all') return publishedPosts.value
  return publishedPosts.value.filter(p => p.category === activeCategory.value)
})

// Truncate content to excerpt
function excerpt(content, length = 120) {
  if (!content) return ''
  return content.length > length ? content.slice(0, length) + '...' : content
}



</script>