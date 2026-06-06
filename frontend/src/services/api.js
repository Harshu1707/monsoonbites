import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
api.interceptors.request.use((config) => { const token = localStorage.getItem('token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
export const uploadUrl = (path) => { if (!path) return 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=80'; return path.startsWith('http') ? path : `${import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'}${path}`; };
