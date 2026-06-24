<template>
  <div>

    <div class="page-header">
      <h1>Blog Posts</h1>
      <RouterLink to="/posts/new" class="btn btn-primary">+ New Post</RouterLink>
    </div>

    <div class="filter-bar">
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search posts..."
          class="search-input"
          @input="handleSearch"
        />
        <button class="search-clear" v-if="searchQuery" @click="searchQuery = ''; handleSearch()">✕</button>
      </div>

      <select v-model="filterStatus" class="filter-select" @change="handleSearch">
        <option value="all">All Status</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>

      <select v-model="filterCategory" class="filter-select" @change="handleSearch">
        <option value="all">All Categories</option>
        <option value="technology">Technology</option>
        <option value="design">Design</option>
        <option value="business">Business</option>
        <option value="lifestyle">Lifestyle</option>
      </select>

      <select v-model="postsPerPage" class="filter-select" @change="currentPage = 1">
        <option :value="5">5 per page</option>
        <option :value="10">10 per page</option>
        <option :value="20">20 per page</option>
      </select>

      <button class="btn btn-outline" v-if="hasActiveFilters" @click="clearFilters">Clear</button>
    </div>

    <div class="results-info">
      <span v-if="hasActiveFilters">
        Showing <strong>{{ filteredPosts.length }}</strong>
        of <strong>{{ store.posts.length }}</strong> posts
      </span>
      <span v-else>
        <strong>{{ store.posts.length }}</strong> posts total
      </span>
      <span style="margin-left: 12px;" v-if="totalPages > 1">
        — Page <strong>{{ currentPage }}</strong> of <strong>{{ totalPages }}</strong>
      </span>
    </div>

    <table class="cms-table" v-if="paginatedPosts.length > 0">
      <thead>
        <tr>
          <th @click="sortBy('id')" class="sortable"># {{ sortIcon('id') }}</th>
          <th @click="sortBy('title')" class="sortable">Title {{ sortIcon('title') }}</th>
          <th>Category</th>
          <th @click="sortBy('status')" class="sortable">Status {{ sortIcon('status') }}</th>
          <th @click="sortBy('date')" class="sortable">Date {{ sortIcon('date') }}</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(post, index) in paginatedPosts" :key="post._id">
          <td>{{ (currentPage - 1) * postsPerPage + index + 1 }}</td>
          <td>
            <div class="post-title-cell">
              <span v-html="highlight(post.title)"></span>
            </div>
          </td>
          <td>
            <span v-if="post.category" class="category-tag">{{ post.category }}</span>
            <span v-else style="color:#ccc;">—</span>
          </td>
          <td>
            <span class="badge" :class="post.status === 'published' ? 'badge-published' : 'badge-draft'">
              {{ post.status }}
            </span>
          </td>
          <td :title="post.createdAt">{{ formatRelative(post.createdAt) }}</td>
          <td class="action-buttons">
            <RouterLink :to="`/posts/edit/${post._id}`" class="btn btn-outline">Edit</RouterLink>
            <button class="btn btn-danger" @click="handleDelete(post._id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="empty-state" v-else-if="hasActiveFilters">
      <p>No posts match your search.</p>
      <button class="btn btn-outline" @click="clearFilters" style="margin-top:12px;">Clear Filters</button>
    </div>

    <div class="empty-state" v-else>
      <p>No posts yet. Click <strong>+ New Post</strong> to get started.</p>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button class="page-btn" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">← Prev</button>
      <template v-for="page in pageNumbers" :key="page">
        <span v-if="page === '...'" class="page-dots">...</span>
        <button
          v-else
          class="page-btn"
          :class="{ 'page-btn-active': page === currentPage }"
          @click="goToPage(page)"
        >{{ page }}</button>
      </template>
      <button class="page-btn" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">Next →</button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePostsStore  } from '../stores/posts.js'
import { useToastStore  } from '../stores/toast.js'
import { useConfirm     } from '../composables/useConfirm.js'
import { useFormatDate  } from '../composables/useFormatDate.js'

const store  = usePostsStore()
const toast  = useToastStore()
const { confirm }        = useConfirm()
const { formatRelative } = useFormatDate()

const searchQuery    = ref('')
const filterStatus   = ref('all')
const filterCategory = ref('all')
const sortColumn     = ref('date')
const sortDirection  = ref('desc')
const currentPage    = ref(1)
const postsPerPage   = ref(5)

onMounted(() => {
  store.fetchPosts()
})

const hasActiveFilters = computed(() =>
  searchQuery.value !== '' ||
  filterStatus.value !== 'all' ||
  filterCategory.value !== 'all'
)

const filteredPosts = computed(() => {
  let result = [...store.posts]

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(p => p.title.toLowerCase().includes(query))
  }

  if (filterStatus.value !== 'all') {
    result = result.filter(p => p.status === filterStatus.value)
  }

  if (filterCategory.value !== 'all') {
    result = result.filter(p => p.category === filterCategory.value)
  }

  result.sort((a, b) => {
    let valA = a[sortColumn.value]
    let valB = b[sortColumn.value]
    if (typeof valA === 'string') { valA = valA.toLowerCase(); valB = valB.toLowerCase() }
    if (valA < valB) return sortDirection.value === 'asc' ? -1 : 1
    if (valA > valB) return sortDirection.value === 'asc' ?  1 : -1
    return 0
  })

  return result
})

const totalPages = computed(() =>
  Math.ceil(filteredPosts.value.length / postsPerPage.value)
)

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage.value
  return filteredPosts.value.slice(start, start + postsPerPage.value)
})

const pageNumbers = computed(() => {
  const pages   = []
  const total   = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    const shown  = new Set([1, total, current, current - 1, current + 1])
    const sorted = [...shown].filter(p => p >= 1 && p <= total).sort((a, b) => a - b)
    for (let i = 0; i < sorted.length; i++) {
      pages.push(sorted[i])
      if (sorted[i + 1] && sorted[i + 1] - sorted[i] > 1) pages.push('...')
    }
  }
  return pages
})

function sortBy(column) {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value    = column
    sortDirection.value = 'asc'
  }
  currentPage.value = 1
}

function sortIcon(column) {
  if (sortColumn.value !== column) return '↕'
  return sortDirection.value === 'asc' ? '↑' : '↓'
}

function highlight(text) {
  if (!searchQuery.value.trim()) return text
  const query = searchQuery.value.trim()
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function clearFilters() {
  searchQuery.value    = ''
  filterStatus.value   = 'all'
  filterCategory.value = 'all'
  currentPage.value    = 1
}

function handleSearch() {
  currentPage.value = 1
}

async function handleDelete(id) {
  const ok = await confirm({
    title:   'Delete Post',
    message: 'This will permanently delete the post. Continue?'
  })
  if (!ok) return
  store.deletePost(id)
  toast.success('Post deleted')
  if (paginatedPosts.value.length === 1 && currentPage.value > 1) {
    currentPage.value--
  }
}
</script>