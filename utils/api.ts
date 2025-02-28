import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
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
    const response = await axios.post(`${BASE_URL}/auth/user/login`, { email, password });
    return response.data;
  } catch (error) {
    // @ts-ignore
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const register = async (name: string, email: string,  phone: string, password: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/user/register`, { name, email, phone, password });
    return response.data;
  } catch (error) {
    // @ts-ignore
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const getHospitals = async () => {
    const response = await axios.get(`${BASE_URL}/hospitals`);
  return response.data;
};

export const getDoctors = async () => {
  const response = await axios.get(`${BASE_URL}/doctors`);
  return response.data;
};

export const bookAppointment = async (appointmentData: {
  userId: string;
  docId: string;
  hospitalId: string;
  date: string;
  time: string;
  fee: number;
}) => {
  const response = await axios.post(`${BASE_URL}/appointments`, appointmentData);
  return response.data;
};

export const getAppointments = async () => {
  const userId = localStorage.getItem('userId');
  const response = await axios.get(`${BASE_URL}/appointments/user/${userId}`);
  return response.data;
}
export default api;