import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = 'https://api.placeholder.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  getAssignments: async () => {
    const response = await apiClient.get('/engineer/assignments');
    return response.data;
  },

  getJobs: async () => {
    const response = await apiClient.get('/engineer/jobs');
    return response.data;
  },

  uploadJob: async (job: any) => {
    const response = await apiClient.post('/engineer/job', job);
    return response.data;
  },

  getPresignedUrl: async (filename: string) => {
    const response = await apiClient.post('/upload/presigned', { filename });
    return response.data;
  },

  uploadToS3: async (presignedUrl: string, file: Blob) => {
    await axios.put(presignedUrl, file, {
      headers: { 'Content-Type': 'image/jpeg' },
    });
  },
};
