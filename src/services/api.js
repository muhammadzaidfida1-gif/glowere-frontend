import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
})

export const sendChat = (sessionId, action = null, message = null) =>
  api.post('/chat', { session_id: sessionId, action, message }).then(r => r.data)

export const trackOrder = (orderId) =>
  api.get(`/orders/${orderId}`).then(r => r.data)

export const analyzeSkin = (imageFile) => {
  const form = new FormData()
  form.append('image', imageFile)
  return api.post('/analyze', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data)
}

export const getProducts = () =>
  api.get('/products').then(r => r.data)
