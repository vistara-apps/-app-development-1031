import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import DeviceSetupPage from './pages/DeviceSetupPage'
import AppConfigPage from './pages/AppConfigPage'

function App() {
  return (
    <div>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/device-setup" element={<DeviceSetupPage />} />
        <Route path="/app-config" element={<AppConfigPage />} />
      </Routes>
    </div>
  )
}

export default App