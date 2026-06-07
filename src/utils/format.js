export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getErrorMessage(error) {
  const data = error.response?.data
  if (data?.details) {
    return Object.values(data.details).join(', ')
  }
  return data?.error || data?.message || error.message || 'Something went wrong'
}

export function extractPageContent(data) {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.content)) return data.content
  return []
}

export function extractPageMeta(data) {
  if (!data || Array.isArray(data)) {
    return { page: 0, size: 20, totalElements: 0, totalPages: 0 }
  }
  return {
    page: data.page ?? 0,
    size: data.size ?? 20,
    totalElements: data.totalElements ?? 0,
    totalPages: data.totalPages ?? 0,
  }
}
