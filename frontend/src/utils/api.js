import axios from 'axios';

const api = axios.create({
  baseURL: 'https://lost-and-found-webapp.onrender.com/api', // Adjust in production
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
