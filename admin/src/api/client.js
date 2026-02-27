import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
})

client.interceptors.request.use((config) => {
  if (config.method !== 'get' && import.meta.env.VITE_ADMIN_SECRET) {
    config.headers['X-Admin-Secret'] = import.meta.env.VITE_ADMIN_SECRET
  }
  return config
})

export default client
