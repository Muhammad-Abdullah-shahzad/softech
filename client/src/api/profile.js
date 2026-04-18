import api from './axiosConfig';

const PROFILE_URL = import.meta.env.VITE_PROFILE_URL || 'http://localhost:5006/profile';

export const getProfile = (userId) => api.get(`${PROFILE_URL}/${userId}`);
export const changePassword = (data) => api.post(`${PROFILE_URL}/change-password`, data);
