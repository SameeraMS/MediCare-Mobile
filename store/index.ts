import { configureStore } from '@reduxjs/toolkit';
import hospitalsReducer from './slices/hospitalsSlice';
import appointmentsReducer from './slices/appointmentsSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    hospitals: hospitalsReducer,
    appointments: appointmentsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;