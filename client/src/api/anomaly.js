import api from './axiosConfig';

const ANOMALY_URL = import.meta.env.VITE_ANOMALY_URL || 'http://localhost:8000/v1';

export const detectAnomalies = (workerId) => api.post(`${ANOMALY_URL}/detect-anomalies`, { workerId });
export const getAnomalyAlerts = (workerId) => api.get(`${ANOMALY_URL}/alerts/${workerId}`);
