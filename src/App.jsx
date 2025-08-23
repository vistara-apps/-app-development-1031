import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import DeviceSetupPage from './pages/DeviceSetupPage'
import AppConfigPage from './pages/AppConfigPage'
import ActivitiesPage from './pages/ActivitiesPage'
import ScoringPage from './pages/ScoringPage'

function App() {
  return (
    <div>
      <Navigation />
      <div style={{ padding: '20px 0' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/scoring" element={<ScoringPage />} />
          <Route path="/device-setup" element={<DeviceSetupPage />} />
          <Route path="/app-config" element={<AppConfigPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
