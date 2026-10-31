import axios from 'axios';

const RAW_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
const API_BASE_URL = RAW_URL.endsWith('/v1') ? RAW_URL : `${RAW_URL.replace(/\/$/, '')}/v1`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('codevoyage_jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (error.config && error.config.url && error.config.url.includes('/users/me')) {
        localStorage.removeItem('codevoyage_jwt');
        localStorage.removeItem('codevoyage_user');
      }
    }
    return Promise.reject(error);
  }
);
