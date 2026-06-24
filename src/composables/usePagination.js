// Composable — reusable pagination logic
// Usage: const { currentPage, paginatedItems, totalPages, goToPage } = usePagination(items, 10)

import { ref, computed } from 'vue'

export function usePagination(items, defaultPerPage = 10) {

  const currentPage  = ref(1)
  const itemsPerPage = ref(defaultPerPage)

  // Slice the array for current page
  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end   = start + itemsPerPage.value
    return items.value.slice(start, end)
  })

  // Total number of pages
  const totalPages = computed(() =>
    Math.ceil(items.value.length / itemsPerPage.value)
  )

  // Smart page numbers with dots
  const pageNumbers = computed(() => {
    const pages   = []
    const total   = totalPages.value
    const current = currentPage.value

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i)
    } else {
      const shown = new Set([1, total, current, current - 1, current + 1])
      const sorted = [...shown]
        .filter(p => p >= 1 && p <= total)
        .sort((a, b) => a - b)

      for (let i = 0; i < sorted.length; i++) {
        pages.push(sorted[i])
        if (sorted[i + 1] && sorted[i + 1] - sorted[i] > 1) {
          pages.push('...')
        }
      }
    }

    return pages
  })

  function goToPage(page) {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetPage() {
    currentPage.value = 1
  }

  return {
    currentPage,
    itemsPerPage,
    paginatedItems,
    totalPages,
    pageNumbers,
    goToPage,
    resetPage,
  }
}