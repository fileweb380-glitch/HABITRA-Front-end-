import React from 'react';
import { AuthProvider } from './features/auth/AuthContext';
import AppRouter from './routes/AppRouter';
import AlarmOverlay from './components/AlarmOverlay';

export default function App() {
  return (
    <AuthProvider>
      <AlarmOverlay />
      <AppRouter />
    </AuthProvider>
  );
}