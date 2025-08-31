import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Global } from '@emotion/react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import UserInfo from './pages/onboarding/UserInfo';
import Goals from './pages/onboarding/Goals';
import Schedule from './pages/onboarding/Schedule';
import TimerPage from './pages/TimerPage';
import CheckInPage from './pages/CheckInPage';
import ProgressPage from './pages/ProgressPage';
import JournalPage from './pages/JournalPage';
import PlanPage from './pages/PlanPage';
import SettingsPage from './pages/SettingsPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import theme from './styles/theme';
import globalStyles from './styles/globalStyles';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Onboarding route component
const OnboardingRoute = ({ children }) => {
  const { currentUser, userProfile } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (userProfile && userProfile.onboardingCompleted) {
    return <Navigate to="/timer" />;
  }
  
  return children;
};

// Public route component (redirect if logged in)
const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (currentUser) {
    return <Navigate to="/timer" />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      
      {/* Onboarding routes */}
      <Route path="/onboarding" element={<OnboardingRoute><UserInfo /></OnboardingRoute>} />
      <Route path="/onboarding/goals" element={<OnboardingRoute><Goals /></OnboardingRoute>} />
      <Route path="/onboarding/schedule" element={<OnboardingRoute><Schedule /></OnboardingRoute>} />
      
      {/* Protected routes */}
      <Route path="/timer" element={<ProtectedRoute><TimerPage /></ProtectedRoute>} />
      <Route path="/check-in" element={<ProtectedRoute><CheckInPage /></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
      <Route path="/journal" element={<ProtectedRoute><JournalPage /></ProtectedRoute>} />
      <Route path="/plan" element={<ProtectedRoute><PlanPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Global styles={globalStyles} />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <div className="app-container">
            <Navigation />
            <main>
              <AppRoutes />
            </main>
          </div>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;

