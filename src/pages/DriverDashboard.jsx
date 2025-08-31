import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'
import { MathuraDataService } from '../services/MathuraDataService'

export default function DriverDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [driverData, setDriverData] = useState(null)
  const [busData, setBusData] = useState(null)
  const [routeData, setRouteData] = useState([])
  const [todaysTrips, setTodaysTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Load driver data
      const { data: driver, error: driverError } = await supabase
        .from('drivers')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (driverError) {
        setError('Failed to load driver data')
        return
      }

      if (driver.status !== 'approved') {
        // Redirect based on status
        switch (driver.status) {
          case 'pending':
            navigate('/driver/application')
            return
          case 'review':
            navigate('/driver/pending')
            return
          case 'rejected':
            navigate('/driver/rejected')
            return
          case 'suspended':
            navigate('/driver/suspended')
            return
        }
      }

      setDriverData(driver)

      // Load assigned bus data
      if (driver.assigned_bus_id) {
        const { data: bus, error: busError } = await supabase
          .from('buses')
          .select('*')
          .eq('id', driver.assigned_bus_id)
          .single()

        if (!busError) {
          setBusData(bus)
        }
      }

      // Load route data
      if (driver.assigned_route_ids && driver.assigned_route_ids.length > 0) {
        const { data: routes, error: routesError } = await supabase
          .from('routes')
          .select('*')
          .in('id', driver.assigned_route_ids)

        if (!routesError) {
          setRouteData(routes || [])
        }
      }

      // Load today's trips
      const today = new Date().toISOString().split('T')[0]
      const { data: trips, error: tripsError } = await supabase
        .from('trips')
        .select(`
          *,
          routes:route_id (name),
          buses:bus_id (bus_number)
        `)
        .eq('driver_id', driver.id)
        .gte('start_time', `${today}T00:00:00`)
        .lt('start_time', `${today}T23:59:59`)
        .order('start_time')

      if (!tripsError) {
        setTodaysTrips(trips || [])
      }

    } catch (err) {
      setError('An error occurred while loading dashboard data')
      console.error('Dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStartTrip = async (tripId) => {
    try {
      const { error } = await supabase.rpc('start_trip', { trip_id: tripId })
      
      if (error) {
        alert('Failed to start trip: ' + error.message)
        return
      }

      // Reload trips data
      loadDashboardData()
      alert('Trip started successfully!')
    } catch (err) {
      alert('Error starting trip')
      console.error('Start trip error:', err)
    }
  }

  const handleEndTrip = async (tripId) => {
    try {
      const { error } = await supabase.rpc('end_trip', { trip_id: tripId })
      
      if (error) {
        alert('Failed to end trip: ' + error.message)
        return
      }

      // Reload trips data
      loadDashboardData()
      alert('Trip completed successfully!')
    } catch (err) {
      alert('Error ending trip')
      console.error('End trip error:', err)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/driver/login')
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: 16
      }}>
        <div style={{ fontSize: '24px' }}>🚌</div>
        <div>Loading Dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: 16
      }}>
        <div style={{ color: '#dc3545', fontSize: '18px' }}>{error}</div>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: 16
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        marginBottom: 20,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#333' }}>
            Welcome, {driverData?.full_name}
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>
            Driver Dashboard - {new Date().toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </div>

      <div style={{
        display: 'grid',
        gap: 20,
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
      }}>
        {/* Vehicle Information */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: 8,
          padding: 20,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>🚌 My Vehicle</h3>
          {busData ? (
            <div style={{ color: '#666' }}>
              <p><strong>Vehicle Number:</strong> {busData.vehicle_number}</p>
              <p><strong>Status:</strong> {busData.status}</p>
              <p><strong>Current Location:</strong> {busData.latitude?.toFixed(4)}, {busData.longitude?.toFixed(4)}</p>
              <p><strong>Last Updated:</strong> {new Date(busData.last_updated).toLocaleString()}</p>
            </div>
          ) : (
            <p style={{ color: '#666' }}>No vehicle assigned yet</p>
          )}
        </div>

        {/* Route Information */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: 8,
          padding: 20,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>🗺️ My Routes</h3>
          {routeData.length > 0 ? (
            <div style={{ color: '#666' }}>
              {routeData.map((route, index) => (
                <div key={route.id} style={{ marginBottom: 8 }}>
                  <strong>Route {index + 1}:</strong> {route.name}
                  {route.description && (
                    <div style={{ fontSize: '14px', color: '#888' }}>
                      {route.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666' }}>No routes assigned yet</p>
          )}
        </div>

        {/* Today's Trips */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: 8,
          padding: 20,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          gridColumn: '1 / -1'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>📅 Today's Trips</h3>
          {todaysTrips.length > 0 ? (
            <div style={{ display: 'grid', gap: 12 }}>
              {todaysTrips.map((trip) => (
                <div
                  key={trip.id}
                  style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 6,
                    padding: 16,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#333' }}>
                      {trip.routes?.name || 'Route'}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      Bus: {trip.buses?.vehicle_number} • 
                      Start: {new Date(trip.scheduled_start_time).toLocaleTimeString()} • 
                      Status: {trip.status}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {trip.status === 'scheduled' && (
                      <button
                        onClick={() => handleStartTrip(trip.id)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Start Trip
                      </button>
                    )}
                    {trip.status === 'active' && (
                      <button
                        onClick={() => handleEndTrip(trip.id)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#ff9800',
                          color: 'white',
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        End Trip
                      </button>
                    )}
                    {trip.status === 'completed' && (
                      <span style={{
                        padding: '8px 16px',
                        backgroundColor: '#f0f0f0',
                        color: '#666',
                        borderRadius: 4,
                        fontSize: '14px'
                      }}>
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666' }}>No trips scheduled for today</p>
          )}
        </div>
      </div>
    </div>
  )
}
