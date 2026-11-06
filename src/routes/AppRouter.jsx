
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { useAuth } from '../features/auth/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';

// Public pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import VerifyEmailPage from '../pages/VerifyEmailPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';

// Protected pages
import OnboardingPage from '../pages/OnboardingPage';
import DashboardPage from '../pages/DashboardPage';
import PlanTomorrowPage from '../pages/PlanTomorrowPage';
import HabitsPage from '../pages/HabitsPage';
import GoalsPage from '../pages/GoalsPage';
import DailyReportPage from '../pages/DailyReportPage';
import WeeklyReportPage from '../pages/WeeklyReportPage';
import SettingsPage from '../pages/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route
          path="/"
          element={
            !user ? (
              <LandingPage />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        <Route
          path="/login"
          element={
            !user ? (
              <LoginPage />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Onboarding */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        {/* Main Application */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/plan-tomorrow" element={<PlanTomorrowPage />} />

          <Route path="/habits" element={<HabitsPage />} />

          <Route path="/goals" element={<GoalsPage />} />

          <Route path="/reports/daily" element={<DailyReportPage />} />

          <Route path="/reports/weekly" element={<WeeklyReportPage />} />

          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </Router>
  );
}

 