import api from './axiosConfig';

const CERTIFICATE_URL = import.meta.env.VITE_CERTIFICATE_URL || 'http://localhost:5005/api/certificates';

export const generateCertificate = (data) => api.post(`${CERTIFICATE_URL}/generate`, data);
export const getCertificateHistory = (workerId) => api.get(`${CERTIFICATE_URL}/history/${workerId}`);
