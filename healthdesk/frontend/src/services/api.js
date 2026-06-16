import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(config => {
  try {
    const user = JSON.parse(localStorage.getItem('hd_user') || '{}')
    if (user.token) config.headers.Authorization = `Bearer ${user.token}`
  } catch {}
  return config
})

// Centralised error interceptor — surfaces server validation messages
api.interceptors.response.use(
  res => res,
  err => {
    const data = err.response?.data
    const message = typeof data === 'object'
      ? (data.message || Object.values(data).join(', '))
      : 'An error occurred'
    return Promise.reject(new Error(message))
  }
)

export const authAPI = {
  login:    (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
}

export const appointmentAPI = {
  book:         (data)         => api.post('/appointments', data),
  getMine:      ()             => api.get('/appointments/mine'),
  getAll:       ()             => api.get('/appointments/all'),
  updateStatus: (id, status)   => api.put(`/appointments/${id}/status?status=${status}`),
}

export const emrAPI = {
  create:       (data)       => api.post('/emr', data),
  getByPatient: (patientId)  => api.get(`/emr/patient/${patientId}`),
  getMine:      ()           => api.get('/emr/mine'),
  downloadPdf:  (id)         => api.get(`/emr/${id}/pdf`, { responseType: 'blob' }),
}

export const userAPI = {
  getDoctors:  () => api.get('/doctors'),
  getPatients: () => api.get('/admin/patients'),
}

export default api
