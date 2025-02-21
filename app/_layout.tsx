import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from '../store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="hospital/[id]" 
          options={{
            headerShown: true,
            headerTitle: 'Hospital Details',
            headerStyle: {
              backgroundColor: '#f8f9fa',
            },
          }} 
        />
      </Stack>
      <StatusBar style="auto" />
    </Provider>
  );
}