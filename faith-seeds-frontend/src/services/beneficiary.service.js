import api from './api'

export const getBeneficiaries = () => api.get('/beneficiaries')
export const getBeneficiary = code => api.get(`/beneficiaries/${code}`)
export const createBeneficiary = data => api.post('/beneficiaries', data)
export const updateBeneficiary = (code, data) => api.put(`/beneficiaries/${code}`, data)
export const deleteBeneficiary = code => api.delete(`/beneficiaries/${code}`)
