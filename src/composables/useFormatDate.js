// Composable — reusable date formatting logic
// Used in: Dashboard, BlogPosts, BlogHome, BlogPost

export function useFormatDate() {

    // "2026-06-01" → "June 1, 2026"
    function formatDate(dateStr) {
      if (!dateStr) return ''
      return new Date(dateStr).toLocaleDateString('en-IN', {
        year:  'numeric',
        month: 'long',
        day:   'numeric',
      })
    }
  
    // "2026-06-01" → "Jun 1"
    function formatShort(dateStr) {
      if (!dateStr) return ''
      return new Date(dateStr).toLocaleDateString('en-IN', {
        month: 'short',
        day:   'numeric',
      })
    }
  
    // "2026-06-01" → "2 days ago" / "3 months ago"
    function formatRelative(dateStr) {
      if (!dateStr) return ''
      const now  = new Date()
      const date = new Date(dateStr)
      const diff = Math.floor((now - date) / 1000) // seconds
  
      if (diff < 60)                return 'just now'
      if (diff < 3600)              return `${Math.floor(diff / 60)} minutes ago`
      if (diff < 86400)             return `${Math.floor(diff / 3600)} hours ago`
      if (diff < 86400 * 7)         return `${Math.floor(diff / 86400)} days ago`
      if (diff < 86400 * 30)        return `${Math.floor(diff / 86400 / 7)} weeks ago`
      if (diff < 86400 * 365)       return `${Math.floor(diff / 86400 / 30)} months ago`
      return `${Math.floor(diff / 86400 / 365)} years ago`
    }
  
    // Today's date formatted nicely
    function today() {
      return new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        year:    'numeric',
        month:   'long',
        day:     'numeric',
      })
    }
  
    return { formatDate, formatShort, formatRelative, today }
  }