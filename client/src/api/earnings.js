import api from './axiosConfig';

const EARNINGS_URL = import.meta.env.VITE_EARNINGS_URL || 'http://localhost:5002/api/earnings';

export const getEarnings = (workerId, status, platform) => {
    let url = `${EARNINGS_URL}?`;
    if (workerId) url += `workerId=${workerId}&`;
    if (status) url += `status=${status}&`;
    if (platform) url += `platform=${platform}&`;
    return api.get(url);
};
export const addEarning = (data) => api.post(EARNINGS_URL, data);
export const getEarningById = (id) => api.get(`${EARNINGS_URL}/${id}`);
export const getVerifierStats = () => api.get(`${EARNINGS_URL}/stats`);
export const updateEarning = (id, data) => api.patch(`${EARNINGS_URL}/${id}`, data);
export const deleteEarning = (id) => api.delete(`${EARNINGS_URL}/${id}`);
export const uploadVerification = (id, formData) => api.post(`${EARNINGS_URL}/${id}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
