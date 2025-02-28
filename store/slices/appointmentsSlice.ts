import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Appointment {
  id: string;
  hospitalId: string;
  doctorId: string;
  patientName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

interface AppointmentsState {
  appointments: Appointment[];
}

const initialState: AppointmentsState = {
  appointments: [],
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    bookAppointment: (state, action: PayloadAction<Omit<Appointment, 'id' | 'status'>>) => {
      const id = Date.now().toString();
      state.appointments.push({
        ...action.payload,
        id,
        status: 'pending',
      });
    },
    updateAppointmentStatus: (state, action: PayloadAction<{ id: string; status: Appointment['status'] }>) => {
      const appointment = state.appointments.find(a => a.id === action.payload.id);
      if (appointment) {
        appointment.status = action.payload.status;
      }
    },

  },
});

export const { bookAppointment, updateAppointmentStatus } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;