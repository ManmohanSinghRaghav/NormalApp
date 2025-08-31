import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth.jsx'
import { Box, Typography, CircularProgress } from '@mui/material'
import { DirectionsBus as BusIcon } from '@mui/icons-material'
import Home from './pages/Home.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import DriverLoginPage from './pages/DriverLoginPage.jsx'
import DriverSignupPage from './pages/DriverSignupPage.jsx'
import DriverSignupPageDebug from './pages/DriverSignupPageDebug.jsx'
import DriverApplicationPage from './pages/DriverApplicationPage.jsx'
import DriverDashboard from './pages/DriverDashboard.jsx'
import DriverPendingPage from './pages/DriverPendingPage.jsx'
import BusesAroundMe from './pages/BusesAroundMe.jsx'
import BusStopsNearMe from './pages/BusStopsNearMe.jsx'
import EnhancedDriverApplication from './pages/EnhancedDriverApplication.jsx'
import './App.css'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: 3,
          bgcolor: 'background.default'
        }}
      >
        <BusIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" fontWeight={600} color="primary">
          NextStop
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Loading your journey...
        </Typography>
        <CircularProgress size={48} />
      </Box>
    )
  }

  return (
    <>
      <Routes>
        {user ? (
          // Authenticated routes
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/buses" element={<BusesAroundMe />} />
            <Route path="/stops" element={<BusStopsNearMe />} />
            <Route path="/driver/application" element={<EnhancedDriverApplication />} />
            <Route path="/driver/dashboard" element={<DriverDashboard />} />
            <Route path="/driver/pending" element={<DriverPendingPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          // Unauthenticated routes
          <>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/driver/login" element={<DriverLoginPage />} />
            <Route path="/driver/signup" element={<DriverSignupPage />} />
            <Route path="/driver/signup-debug" element={<DriverSignupPageDebug />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
