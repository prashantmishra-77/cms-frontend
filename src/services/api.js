const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'


async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(err.message || `API Error ${response.status}`)
  }

  if (response.status === 204) return null
  return response.json()
}

// ============================================
// POSTS
// ============================================

export const postsApi = {
  getAll(params = {}) {
    const query = new URLSearchParams(params).toString()
    return request(`/posts${query ? '?' + query : ''}`)
  },

  getById(id) {
    return request(`/posts/${id}`)
  },

  getBySlug(slug) {
    return request(`/posts/slug/${slug}`)
  },

  create(data) {
    return request('/posts', {
      method: 'POST',
      body:   JSON.stringify(data),
    })
  },

  update(id, data) {
    return request(`/posts/${id}`, {
      method: 'PUT',
      body:   JSON.stringify(data),
    })
  },

  delete(id) {
    return request(`/posts/${id}`, { method: 'DELETE' })
  },
}

// ============================================
// MEDIA
// ============================================

export const mediaApi = {
  getAll() {
    return request('/media')
  },

  // Upload actual file
  upload(file) {
    const formData = new FormData()
    formData.append('image', file.rawFile)

    return fetch(`${BASE_URL}/media/upload`, {
      method: 'POST',
      body:   formData,
      // No Content-Type header — browser sets it automatically with boundary
    }).then(res => res.json())
  },

  delete(id) {
    return request(`/media/${id}`, { method: 'DELETE' })
  },
}