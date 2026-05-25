import axios from 'axios'

const getBaseURL = () => {
  const hostname = window.location.hostname
  return `http://${hostname}:4000/api`
}

const api = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' },
})

export default api
