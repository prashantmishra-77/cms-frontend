<template>
  <div class="public-layout">

    <!-- PUBLIC HEADER -->
    <header class="public-header">
      <div class="public-header-inner">
        <RouterLink to="/blog" class="public-logo">📝 My Blog</RouterLink>
        <nav class="public-nav">
          <RouterLink to="/blog">Home</RouterLink>
          <a href="/">Admin ↗</a>
        </nav>
      </div>
    </header>

    <!-- POST NOT FOUND -->
    <div class="public-container" v-if="!post">
      <div class="public-empty" style="margin-top: 60px;">
        <p style="font-size: 48px;">404</p>
        <p>Post not found.</p>
        <RouterLink to="/blog" class="btn btn-primary" style="margin-top: 16px; display:inline-flex;">
          ← Back to Blog
        </RouterLink>
      </div>
    </div>

    <!-- POST CONTENT -->
    <div v-else>

      <!-- POST HERO -->
      <div class="post-hero" :class="`cover-${post.category || 'default'}`">
        <div class="post-hero-inner">
          <span class="post-hero-category">{{ post.category || 'general' }}</span>
          <h1 class="post-hero-title">{{ post.title }}</h1>
          <p class="post-hero-date">{{ formatDate(post.date) }}</p>
        </div>
      </div>

      <!-- POST BODY -->
      <div class="public-container">
        <div class="post-body-wrap">

          <!-- BACK LINK -->
          <RouterLink to="/blog" class="post-back">← Back to all posts</RouterLink>

          <!-- CONTENT -->
          <div class="post-content">
            <p>{{ post.content }}</p>
          </div>

          <!-- POST FOOTER -->
          <div class="post-footer">
            <span class="badge badge-published" v-if="post.status === 'published'">
              Published
            </span>
            <RouterLink
              :to="`/posts/edit/${post.id}`"
              class="btn btn-outline"
              style="font-size: 13px;"
            >
              ✏️ Edit in CMS
            </RouterLink>
          </div>

          <!-- RELATED POSTS -->
          <div class="related-posts" v-if="relatedPosts.length > 0">
            <h3>Related posts</h3>
            <div class="related-grid">
              <RouterLink
                v-for="related in relatedPosts"
                :key="related.id"
                :to="`/blog/${related.slug}`"
                class="related-card"
              >
                <div class="related-cover" :class="`cover-${related.category || 'default'}`"></div>
                <div class="related-info">
                  <p class="related-title">{{ related.title }}</p>
                  <p class="related-date">{{ formatDate(related.date) }}</p>
                </div>
              </RouterLink>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <footer class="public-footer">
      <p>© 2026 My Blog. Built with Vue.js</p>
    </footer>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePostsStore } from '../../stores/posts.js'
import { useFormatDate } from '../../composables/useFormatDate.js'

const route = useRoute()
const store = usePostsStore()

// Find post by slug from URL
const post = computed(() =>
  store.posts.find(p => p.slug === route.params.slug && p.status === 'published')
)

// Related posts — same category, exclude current
const relatedPosts = computed(() => {
  if (!post.value) return []
  return store.posts
    .filter(p =>
      p.id !== post.value.id &&
      p.category === post.value.category &&
      p.status === 'published'
    )
    .slice(0, 3)
})

const { formatDate } = useFormatDate()
</script>