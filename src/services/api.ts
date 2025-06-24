// Import axios and InternalAxiosRequestConfig for request configuration type
import axios, { InternalAxiosRequestConfig } from 'axios';
// Create an axios instance for API calls

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://192.168.0.87:3000/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});


// API.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//   if (typeof window !== 'undefined') {
//     const token = localStorage.getItem('token');
//     const tenantId = localStorage.getItem('tenantId');

//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }

//     if (tenantId) {
//       config.headers['X-Tenant-ID'] = tenantId;
//     }
//   }

//   return config;
// });

export default API;
