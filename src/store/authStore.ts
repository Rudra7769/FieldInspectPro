import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
}

const AUTH_TOKEN_KEY = '@field_inspector_token';
const USER_KEY = '@field_inspector_user';

const DEMO_CREDENTIALS = {
  email: 'demo@engineer.com',
  password: 'demo123',
};

const DEMO_USER: User = {
  id: 'demo-user-001',
  name: 'John Smith',
  email: 'demo@engineer.com',
  engineerId: 'ENG-2024-001',
  assignedRegion: 'North District',
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      if (email.toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
        const token = `demo_token_${Date.now()}`;
        
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(DEMO_USER));
  
        set({ user: DEMO_USER, token, isAuthenticated: true });
      } else {
        throw new Error('Invalid credentials. Use demo@engineer.com / demo123');
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadSession: async () => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      const userJson = await AsyncStorage.getItem(USER_KEY);

      if (token && userJson) {
        const user = JSON.parse(userJson);
        set({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));
