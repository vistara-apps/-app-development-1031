import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Navigation from './components/Navigation'
import DashboardPage from './pages/DashboardPage'
import AppointmentsPage from './pages/AppointmentsPage'
import SettingsPage from './pages/SettingsPage'

// Create a theme with salon-friendly colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#7e57c2', // Purple shade
    },
    secondary: {
      main: '#26a69a', // Teal shade
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <Navigation />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default App
