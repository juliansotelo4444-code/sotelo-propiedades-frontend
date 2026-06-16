import api from './api'

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  verifyEmail: (token) => api.get(`/auth/verify-email?token=${token}`),
  getMe: () => api.get('/auth/me'),
}

export const propertiesAPI = {
  getAll: (params) => api.get('/properties', { params }),
  getMine: (params) => api.get('/properties/me/list', { params }),
  getById: (id) => api.get(`/properties/${id}`),
  getStats: () => api.get('/properties/stats'),
  create: (data) => api.post('/properties', data),
  update: (id, data) => api.put(`/properties/${id}`, data),
  delete: (id) => api.delete(`/properties/${id}`),
}

export const propertyTypesAPI = {
  getAll: () => api.get('/property-types'),
  create: (data) => api.post('/property-types', data),
  update: (id, data) => api.put(`/property-types/${id}`, data),
  delete: (id) => api.delete(`/property-types/${id}`),
}
