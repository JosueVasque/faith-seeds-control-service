import api from './api'

// Escuelas
export const getSchools = () => api.get('/catalogs/schools')
export const createSchool = data => api.post('/catalogs/schools', data)
export const updateSchool = (id, data) => api.put(`/catalogs/schools/${id}`, data)
export const deleteSchool = id => api.delete(`/catalogs/schools/${id}`)

// Grados
export const getGrades = () => api.get('/catalogs/grades')
export const createGrade = data => api.post('/catalogs/grades', data)
export const updateGrade = (id, data) => api.put(`/catalogs/grades/${id}`, data)
export const deleteGrade = id => api.delete(`/catalogs/grades/${id}`)

// Horarios
export const getSchedules = () => api.get('/catalogs/schedules')
export const createSchedule = data => api.post('/catalogs/schedules', data)
export const updateSchedule = (id, data) => api.put(`/catalogs/schedules/${id}`, data)
export const deleteSchedule = id => api.delete(`/catalogs/schedules/${id}`)
