import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// defineStore('unique-name', setup function)
export const usePostsStore = defineStore('posts', () => {

  // ============================================
  // STATE — the actual data (like ref() in components)
  // ============================================

  const posts = ref([
    { id: 1,  title: 'Welcome to My Blog',         slug: 'welcome',          content: 'First post.',          status: 'published', category: 'technology', date: '2026-01-10', featuredImage: 'https://picsum.photos/seed/hero/800/600', },
    { id: 2,  title: 'Getting Started with Vue',   slug: 'vue-start',        content: 'Vue basics.',          status: 'published', category: 'technology', date: '2026-01-15' },
    { id: 3,  title: 'CSS Tips and Tricks',        slug: 'css-tips',         content: 'CSS tricks.',          status: 'draft',     category: 'design',     date: '2026-02-01' },
    { id: 4,  title: 'Understanding Pinia',        slug: 'pinia-guide',      content: 'Pinia state.',         status: 'published', category: 'technology', date: '2026-02-14' },
    { id: 5,  title: 'Building a CMS',             slug: 'build-cms',        content: 'CMS tutorial.',        status: 'published', category: 'technology', date: '2026-03-01' },
    { id: 6,  title: 'Design Systems Explained',   slug: 'design-systems',   content: 'Design tokens.',       status: 'draft',     category: 'design',     date: '2026-03-10' },
    { id: 7,  title: 'Vue Router Deep Dive',       slug: 'vue-router',       content: 'Routing in Vue.',      status: 'published', category: 'technology', date: '2026-03-20' },
    { id: 8,  title: 'Business Growth Tips',       slug: 'business-growth',  content: 'Grow your business.',  status: 'published', category: 'business',   date: '2026-04-01' },
    { id: 9,  title: 'Lifestyle Productivity',     slug: 'productivity',     content: 'Stay productive.',     status: 'draft',     category: 'lifestyle',  date: '2026-04-15' },
    { id: 10, title: 'JavaScript Best Practices',  slug: 'js-best',          content: 'Write better JS.',     status: 'published', category: 'technology', date: '2026-05-01' },
    { id: 11, title: 'Tailwind vs Custom CSS',     slug: 'tailwind-vs-css',  content: 'CSS comparison.',      status: 'draft',     category: 'design',     date: '2026-05-10' },
    { id: 12, title: 'Starting a Blog in 2026',    slug: 'start-blog-2026',  content: 'Blog setup guide.',    status: 'published', category: 'lifestyle',  date: '2026-06-01' },
  ])

  // ============================================
  // GETTERS — computed values from state
  // ============================================

  // Total count of all posts
  const totalPosts = computed(() => posts.value.length)

  // Only published posts
  const publishedPosts = computed(() =>
    posts.value.filter(p => p.status === 'published')
  )

  // Only draft posts
  const draftPosts = computed(() =>
    posts.value.filter(p => p.status === 'draft')
  )

  // Find one post by id
  function getPostById(id) {
    return posts.value.find(p => p._id === id || p._id?.toString() === id)
    }

  // ============================================
  // ACTIONS — functions that modify state
  // ============================================

  function addPost(postData) {
    posts.value.push({
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...postData,   // spread the form data on top
    })
  }

  async function updatePost(id, postData) {
    loading.value = true
    try {
      const existing = posts.value.find(p => p._id === id)
      const updated  = await postsApi.update(id, {
        ...existing,
        ...postData,
      })
      const index = posts.value.findIndex(p => p._id === id)
      if (index !== -1) posts.value[index] = updated
      return updated
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deletePost(id) {
    loading.value = true
    try {
      await postsApi.delete(id)
      posts.value = posts.value.filter(p => p._id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ============================================
  // RETURN everything so components can use it
  // ============================================

  return {
    // state
    posts,
    // getters
    totalPosts,
    publishedPosts,
    draftPosts,
    getPostById,
    // actions
    addPost,
    updatePost,
    deletePost,
  }
})