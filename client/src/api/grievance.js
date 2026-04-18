import api from './axiosConfig';

const GRIEVANCE_URL = import.meta.env.VITE_GRIEVANCE_URL || 'http://localhost:5003/api/grievances';

export const getGrievances = (workerId) => api.get(`${GRIEVANCE_URL}?workerId=${workerId}`);
export const createGrievance = (data) => api.post(GRIEVANCE_URL, data);
export const getTrendingGrievances = () => api.get(`${GRIEVANCE_URL}/trending`);

const COMMUNITY_URL = 'http://localhost:5003/api/community';
export const getCommunityPosts = (params) => api.get(COMMUNITY_URL, { params });
export const createCommunityPost = (data) => api.post(COMMUNITY_URL, data);
export const getCommunityTrending = () => api.get(`${COMMUNITY_URL}/trending`);
export const getMyCommunityPosts = (workerId) => api.get(`${COMMUNITY_URL}/my-posts?workerId=${workerId}`);
export const updatePostStatus = (id, data) => api.patch(`${COMMUNITY_URL}/${id}/status`, data);
export const getAdvocateCommunityStats = () => api.get(`${COMMUNITY_URL}/advocate-stats`);
export const createBroadcast = (data) => api.post(`${COMMUNITY_URL}/broadcast`, data);
export const getBroadcasts = () => api.get(`${COMMUNITY_URL}/broadcasts`);
