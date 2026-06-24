import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { postsApi } from '../services/api.js'

export const usePostsStore = defineStore('posts', () => {

  const posts   = ref([])
  const loading = ref(false)
  const error   = ref(null)

  const totalPosts     = computed(() => posts.value.length)
  const publishedPosts = computed(() => posts.value.filter(p => p.status === 'published'))
  const draftPosts     = computed(() => posts.value.filter(p => p.status === 'draft'))

  function getPostById(id) {
    return posts.value.find(p => p._id === id || p._id?.toString() === id)
  }

  async function fetchPosts() {
    loading.value = true
    error.value   = null
    try {
      posts.value = await postsApi.getAll()
    } catch (err) {
      error.value = err.message
      console.error('fetchPosts error:', err)
    } finally {
      loading.value = false
    }
  }

  async function addPost(postData) {
    loading.value = true
    try {
      const newPost = await postsApi.create({
        ...postData,
        date: new Date().toISOString().split('T')[0],
      })
      posts.value.unshift(newPost)
      return newPost
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updatePost(id, postData) {
    loading.value = true
    try {
      const existing = getPostById(id)
      const updated  = await postsApi.update(id, { ...existing, ...postData })
      const index    = posts.value.findIndex(p => p._id === id || p._id?.toString() === id)
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
      posts.value = posts.value.filter(p => p._id !== id && p._id?.toString() !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    posts,
    loading,
    error,
    totalPosts,
    publishedPosts,
    draftPosts,
    getPostById,
    fetchPosts,
    addPost,
    updatePost,
    deletePost,
  }
})