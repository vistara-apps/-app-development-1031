import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import DeviceSetupPage from './pages/DeviceSetupPage'
import AppConfigPage from './pages/AppConfigPage'
import MessagingPage from './pages/MessagingPage'

function App() {
  return (
    <div>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/device-setup" element={<DeviceSetupPage />} />
        <Route path="/app-config" element={<AppConfigPage />} />
        <Route path="/messaging" element={<MessagingPage />} />
      </Routes>
    </div>
  )
}

export default App
