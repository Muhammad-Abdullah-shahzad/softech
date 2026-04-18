import api from './axiosConfig';

const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:5000/api/auth';

export const login = (data) => api.post(`${AUTH_URL}/login`, data);
export const signup = (data) => api.post(`${AUTH_URL}/register`, data);
export const getProfile = () => api.get(`${AUTH_URL}/profile`);
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};
