import api from './api'

export const getTutors = () => api.get('/tutors')
export const getTutor = id => api.get(`/tutors/${id}`)
export const createTutor = data => api.post('/tutors', data)
export const updateTutor = (id, data) => api.put(`/tutors/${id}`, data)
export const deleteTutor = id => api.delete(`/tutors/${id}`)
