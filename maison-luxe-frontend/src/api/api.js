import axios from 'axios'

const normalizedBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/+$/, '')

const api = axios.create({
  baseURL: normalizedBase,
  withCredentials: true
})

export default api