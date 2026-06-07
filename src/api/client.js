import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

/** Backend may return two JSON objects concatenated when the JWT filter runs twice. */
export function parseApiJson(data) {
  if (data == null || typeof data !== 'string') return data
  const trimmed = data.trim()
  if (!trimmed) return null

  try {
    return JSON.parse(trimmed)
  } catch {
    let depth = 0
    for (let i = 0; i < trimmed.length; i += 1) {
      const char = trimmed[i]
      if (char === '{') depth += 1
      if (char === '}') depth -= 1
      if (depth === 0) {
        return JSON.parse(trimmed.slice(0, i + 1))
      }
    }
    throw new Error('Invalid API response')
  }
}

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  transformResponse: [(data) => parseApiJson(data)],
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default client
