import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:2021/api/v1',
  withCredentials: true
});

// Add a request interceptor to inject the token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
