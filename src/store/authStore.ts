// src/store/authStore.ts

import { create } from "zustand";
import { authService } from "../services/authService";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      const { token, engineer } = await authService.login(email, password);

      set({
        token,
        user: engineer,
        isAuthenticated: true,
      });
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || err.message || "Login failed");
    }
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadSession: async () => {
    try {
      const { token, user } = await authService.loadSessionFromStorage();

      if (token && user) {
        set({ token, user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      set({ isLoading: false });
    }
  },
}));
