import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Authorization Bearer token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('foodbridge_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor for consistent error messaging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  demoLogin: (role) => api.post('/auth/demo-login', { role }),
  getMe: () => api.get('/auth/me')
};

export const donationAPI = {
  getAll: (params) => api.get('/donations', { params }),
  getFeatured: () => api.get('/donations/featured'),
  getMatching: () => api.get('/donations/matching'),
  getMyDonations: () => api.get('/donations/my-donations'),
  getById: (id) => api.get(`/donations/${id}`),
  create: (data) => api.post('/donations', data),
  update: (id, data) => api.put(`/donations/${id}`, data),
  delete: (id) => api.delete(`/donations/${id}`)
};

export const requestAPI = {
  create: (data) => api.post('/requests', data),
  getForDonor: () => api.get('/requests/donor'),
  getForNgo: () => api.get('/requests/ngo'),
  getById: (id) => api.get(`/requests/${id}`),
  updateStatus: (id, data) => api.put(`/requests/${id}/status`, data)
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all')
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getAnalytics: () => api.get('/admin/analytics'),
  getUsers: (params) => api.get('/admin/users', { params }),
  verifyUser: (id) => api.put(`/admin/users/${id}/verify`),
  setUserStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status }),
  getDonations: () => api.get('/admin/donations'),
  deleteDonation: (id) => api.delete(`/admin/donations/${id}`),
  getRequests: () => api.get('/admin/requests')
};

export const contactAPI = {
  submit: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact')
};

export default api;
