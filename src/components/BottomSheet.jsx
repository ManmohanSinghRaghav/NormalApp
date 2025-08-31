import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function BottomSheet({ isOpen, onClose, stopData, onViewRoute }) {
  const [loading, setLoading] = useState(false)
  const [upcomingTrips, setUpcomingTrips] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen && stopData) {
      fetchUpcomingTrips()
    }
  }, [isOpen, stopData])

  const fetchUpcomingTrips = async () => {
    if (!stopData?.route_id) return

    setLoading(true)
    setError(null)

    try {
      const now = new Date().toISOString()
      const endOfDay = new Date()
      endOfDay.setHours(23, 59, 59, 999)
      
      const { data, error } = await supabase
        .from('trips')
        .select(`
          *,
          routes:route_id (name, description),
          buses:bus_id (vehicle_number, status)
        `)
        .eq('route_id', stopData.route_id)
        .gte('scheduled_start_time', now)
        .lte('scheduled_start_time', endOfDay.toISOString())
        .order('scheduled_start_time')
        .limit(10)

      if (error) {
        setError('Failed to fetch upcoming trips')
        console.error('Error fetching trips:', error)
      } else {
        setUpcomingTrips(data || [])
      }
    } catch (err) {
      setError('An error occurred while fetching trip data')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'flex-end'
    }}>
      <div style={{
        backgroundColor: 'white',
        width: '100%',
        maxHeight: '70vh',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
        animation: 'slideUp 0.3s ease-out'
      }}>
        {/* Handle */}
        <div style={{
          width: '40px',
          height: '4px',
          backgroundColor: '#e0e0e0',
          borderRadius: '2px',
          margin: '12px auto 0',
          cursor: 'pointer'
        }} onClick={onClose} />

        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}>
            <div style={{ flex: 1 }}>
              <h3 style={{
                margin: '0 0 4px 0',
                fontSize: '20px',
                fontWeight: '600',
                color: '#333'
              }}>
                {stopData?.name || 'Bus Stop'}
              </h3>
              {stopData?.route_name && (
                <p style={{
                  margin: '0 0 8px 0',
                  fontSize: '14px',
                  color: '#666'
                }}>
                  Route: {stopData.route_name}
                </p>
              )}
              {stopData?.distance && (
                <p style={{
                  margin: 0,
                  fontSize: '12px',
                  color: '#999'
                }}>
                  📍 {stopData.distance.toFixed(2)} km away
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '4px',
                color: '#666'
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{
          padding: '0 24px 24px',
          maxHeight: 'calc(70vh - 120px)',
          overflowY: 'auto'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '20px 0 16px'
          }}>
            <h4 style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: '600',
              color: '#333'
            }}>
              Upcoming Buses
            </h4>
            <ViewRouteButton stopData={stopData} onViewRoute={onViewRoute} />
          </div>

          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 0',
              color: '#666'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>🚌</div>
              Loading...
            </div>
          ) : error ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 0',
              color: '#f44336'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>⚠️</div>
              {error}
            </div>
          ) : upcomingTrips.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 0',
              color: '#666'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🚌</div>
              <p style={{ margin: 0, fontSize: '16px' }}>No buses scheduled</p>
              <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#999' }}>
                Check back later for updated schedules
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {upcomingTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

function TripCard({ trip }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return { bg: '#e3f2fd', color: '#1976d2', text: 'Scheduled' }
      case 'active': return { bg: '#e8f5e8', color: '#388e3c', text: 'Active' }
      case 'completed': return { bg: '#f5f5f5', color: '#757575', text: 'Completed' }
      case 'cancelled': return { bg: '#ffebee', color: '#d32f2f', text: 'Cancelled' }
      default: return { bg: '#f5f5f5', color: '#757575', text: status }
    }
  }

  const getRelativeTime = (timestamp) => {
    const now = new Date()
    const tripTime = new Date(timestamp)
    const diffMinutes = Math.floor((tripTime - now) / (1000 * 60))

    if (diffMinutes < 0) return 'Departed'
    if (diffMinutes === 0) return 'Arriving now'
    if (diffMinutes < 60) return `${diffMinutes} min`
    
    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60
    return `${hours}h ${minutes}m`
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const statusInfo = getStatusColor(trip.status)
  const relativeTime = getRelativeTime(trip.scheduled_start_time)

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      padding: '16px',
      backgroundColor: '#fafafa'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '4px'
          }}>
            <span style={{ fontSize: '18px' }}>🚌</span>
            <span style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#333'
            }}>
              {trip.buses?.vehicle_number || 'Bus'}
            </span>
          </div>
          <p style={{
            margin: '0 0 4px 0',
            fontSize: '14px',
            color: '#666'
          }}>
            {trip.routes?.name || 'Route'}
          </p>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <div style={{
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: statusInfo.bg,
            color: statusInfo.color,
            marginBottom: '4px'
          }}>
            {statusInfo.text}
          </div>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: trip.status === 'active' ? '#4CAF50' : '#333'
          }}>
            {relativeTime}
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#999'
      }}>
        <span>Departure: {formatTime(trip.scheduled_start_time)}</span>
        <span>Arrival: {formatTime(trip.scheduled_end_time)}</span>
      </div>
    </div>
  )
}

function ViewRouteButton({ stopData, onViewRoute }) {
  const [loading, setLoading] = useState(false)

  const handleViewRoute = async () => {
    if (!stopData?.route_id || !onViewRoute) return

    setLoading(true)
    try {
      await onViewRoute(stopData.route_id, stopData.route_name)
    } catch (err) {
      console.error('Error viewing route:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleViewRoute}
      disabled={loading}
      style={{
        padding: '8px 16px',
        backgroundColor: loading ? '#ccc' : '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.2s'
      }}
    >
      {loading ? 'Loading...' : '🗺️ View Route'}
    </button>
  )
}
