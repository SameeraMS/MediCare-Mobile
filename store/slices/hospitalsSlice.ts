import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  image: string;
  experience: number;
  rating: number;
  availableSlots: string[];
}

interface Hospital {
  id: string;
  name: string;
  address: string;
  image: string;
  rating: number;
  doctorsCount: number;
  doctors: Doctor[];
}

interface HospitalsState {
  hospitals: Hospital[];
  selectedHospital: Hospital | null;
}

const initialState: HospitalsState = {
  hospitals: [
    {
      id: '1',
      name: 'Central Hospital',
      address: '123 Healthcare Ave, Medical District',
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=500&auto=format&fit=crop',
      rating: 4.8,
      doctorsCount: 50,
      doctors: [
        {
          id: 'd1',
          name: 'Dr. Sarah Johnson',
          specialization: 'Cardiologist',
          image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop',
          experience: 12,
          rating: 4.9,
          availableSlots: ['09:00', '10:00', '14:00', '16:00'],
        },
        // Add more doctors...
      ],
    },
    {
      id: '2',
      name: 'City Medical Center',
      address: '456 Health Street, Downtown',
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=500&auto=format&fit=crop',
      rating: 4.6,
      doctorsCount: 35,
      doctors: [
        {
          id: 'd2',
          name: 'Dr. Michael Chen',
          specialization: 'Neurologist',
          image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop',
          experience: 15,
          rating: 4.8,
          availableSlots: ['11:00', '13:00', '15:00', '17:00'],
        },
        // Add more doctors...
      ],
    },
  ],
  selectedHospital: null,
};

const hospitalsSlice = createSlice({
  name: 'hospitals',
  initialState,
  reducers: {
    setSelectedHospital: (state, action: PayloadAction<string>) => {
      state.selectedHospital = state.hospitals.find(h => h.id === action.payload) || null;
    },
  },
});

export const { setSelectedHospital } = hospitalsSlice.actions;
export default hospitalsSlice.reducer;