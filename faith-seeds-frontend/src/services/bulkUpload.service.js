import axios from 'axios'

const getBaseURL = () => {
  const hostname = window.location.hostname
  return `http://${hostname}:4000/api`
}

const api = axios.create({
  baseURL: getBaseURL(),
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
