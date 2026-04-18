import api from './axiosConfig';

const ANALYTICS_URL = import.meta.env.VITE_ANALYTICS_URL || 'http://localhost:5004/api/analytics';

export const getWorkerStats = (workerId) => api.get(`${ANALYTICS_URL}/worker/${workerId}`);
export const getPlatformComparison = (workerId) => api.get(`${ANALYTICS_URL}/comparison/${workerId}`);
export const getCityMedian = (city) => api.get(`${ANALYTICS_URL}/city-median?city=${city}`);
export const getTrends = (workerId, period = 'weekly') => api.get(`${ANALYTICS_URL}/trends/${workerId}?period=${period}`);
export const getCommunityInsights = () => api.get(`${ANALYTICS_URL}/community-insights`);
export const getVerifierOverview = () => api.get(`${ANALYTICS_URL}/verifier/overview`);
export const getAdvocateOverview = () => api.get(`${ANALYTICS_URL}/advocate/overview`);
