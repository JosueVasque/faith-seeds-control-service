import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
})

export const uploadFamilies = file => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/bulk-upload/families', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const uploadGeneralData = file => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/bulk-upload/general-data', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
