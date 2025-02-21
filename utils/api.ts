import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: 'https://api.example.com', // Replace with your actual API URL
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (email: string, password: string, name: string) => {
  try {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;