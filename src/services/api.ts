// src/services/api.ts

import axios from "axios";
import { useAuthStore } from "../store/authStore";

// ⚠️ CHANGE THIS TO YOUR LAPTOP IP
export const API_BASE_URL = "http://192.168.1.5:4000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// Attach token to headers
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // LOGIN
  login: async (email: string, password: string) => {
    const res = await apiClient.post("/auth/login", { email, password });
    return res.data;
  },

  // Fetch assigned societies
  getAssignments: async () => {
    const res = await apiClient.get("/engineer/assignments");
    return res.data;
  },

  // Submit completed / not completed job
  uploadJob: async (job: any) => {
    const res = await apiClient.post("/engineer/job", job);
    return res.data;
  },
};

export default apiClient;
