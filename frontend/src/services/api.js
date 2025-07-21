import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      const rememberMe = localStorage.getItem('rememberMe') === 'true';

      if (refreshToken && rememberMe) {
        try {
          const response = await axios.post(`${API_BASE_URL}/refresh`, {
            refreshToken
          });

          const { accessToken } = response.data;
          localStorage.setItem('token', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('username');
          localStorage.removeItem('rememberMe');
          window.location.href = '/login';
        }
      } else {
        // No refresh token or remember me not set, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('username');
        localStorage.removeItem('rememberMe');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  register: (userData) => api.post('/register', userData),
  login: (credentials) => api.post('/login', credentials),
  logout: () => api.post('/logout', {
    refreshToken: localStorage.getItem('refreshToken')
  }),
  getProtected: () => api.get('/protected'),
  refreshToken: (refreshToken) => api.post('/refresh', { refreshToken }),
};

export default api;
