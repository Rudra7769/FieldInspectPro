// src/services/authService.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";

const AUTH_TOKEN_KEY = "@field_inspector_token";
const USER_KEY = "@field_inspector_user";

export const authService = {
  login: async (email: string, password: string) => {
    const res = await api.login(email, password);
    const { token, engineer } = res;

    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(engineer));

    return { token, engineer };
  },

  logout: async () => {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  },

  loadSessionFromStorage: async () => {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    const userJson = await AsyncStorage.getItem(USER_KEY);
    const user = userJson ? JSON.parse(userJson) : null;

    return { token, user };
  },
};
