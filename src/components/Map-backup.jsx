import React, { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import { supabase } from '../lib/supabaseClient'
import BottomSheet from './BottomSheet.jsx'
import L from 'leaflet'

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Unicode-safe base64 encoding function
const unicodeToBase64 = (str) => {
  return btoa(unescape(encodeURIComponent(str)))
}

// Custom icons with SVG instead of emojis
const busIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + unicodeToBase64(`
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" fill="#4CAF50" stroke="#fff" stroke-width="2"/>
      <rect x="8" y="10" width="16" height="12" rx="2" fill="white"/>
      <rect x="10" y="12" width="4" height="3" fill="#4CAF50"/>
      <rect x="18" y="12" width="4" height="3" fill="#4CAF50"/>
      <circle cx="12" cy="20" r="1.5" fill="#4CAF50"/>
      <circle cx="20" cy="20" r="1.5" fill="#4CAF50"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
})

const stopIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + unicodeToBase64(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="#2196F3" stroke="#fff" stroke-width="2"/>
      <rect x="8" y="6" width="8" height="12" rx="1" fill="white"/>
      <rect x="9" y="8" width="6" height="1" fill="#2196F3"/>
      <rect x="9" y="10" width="6" height="1" fill="#2196F3"/>
      <rect x="9" y="12" width="6" height="1" fill="#2196F3"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
})

// Component to handle map updates
function MapUpdater({ center, buses, mapRef, routePolyline, routeWaypoints }) {
  const map = useMap()
  const busMarkersRef = useRef(new Map())

  useEffect(() => {
    if (mapRef) {
      mapRef.current = map
    }
  }, [map, mapRef])

  useEffect(() => {
    if (center) {
      map.setView(center, 13)
    }
  }, [center, map])

  return null
}

function Map() {
  const [center, setCenter] = useState([27.4924, 77.6737]) // Default to Mathura
  const [nearbyStops, setNearbyStops] = useState([])
  const [buses, setBuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedStop, setSelectedStop] = useState(null)
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)
  const [routePolyline, setRoutePolyline] = useState(null)
  const [routeWaypoints, setRouteWaypoints] = useState([])
  const mapRef = useRef()

  // Get user's current location and fetch nearby stops
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude
          const userLng = position.coords.longitude
          setCenter([userLat, userLng])
          fetchNearbyStops(userLat, userLng)
        },
        () => {
          console.log('Location access denied, using default location')
          fetchNearbyStops(center[0], center[1])
        }
      )
    } else {
      setError('Geolocation is not supported by this browser.')
      setLoading(false)
    }
  }, [])

  const fetchNearbyStops = async (lat, lng) => {
    try {
      setLoading(true)
      
      // Provide mock data for demonstration
      const mockStops = [
        {
          id: '1',
          name: 'Central Bus Stop',
          latitude: lat + 0.005,
          longitude: lng + 0.005,
          route_name: 'Route 1',
          distance: '0.5 km'
        },
        {
          id: '2', 
          name: 'Station Road',
          latitude: lat - 0.005,
          longitude: lng - 0.005,
          route_name: 'Route 2',
          distance: '0.8 km'
        },
        {
          id: '3',
          name: 'Market Square',
          latitude: lat + 0.003,
          longitude: lng - 0.003,
          route_name: 'Route 3',
          distance: '0.3 km'
        }
      ]
      
      setNearbyStops(mockStops)
      setLoading(false)
    } catch (err) {
      console.error('Error in fetchNearbyStops:', err)
      setError('Unable to load stops. Please try again.')
      setLoading(false)
    }
  }

  const fetchCurrentBuses = async () => {
    try {
      // Provide mock bus data
      const mockBuses = [
        {
          id: '1',
          vehicle_number: 'UP80-1234',
          driver_name: 'Demo Driver 1',
          latitude: 27.4991,
          longitude: 77.6713,
          route_id: '1',
          status: 'active'
        },
        {
          id: '2',
          vehicle_number: 'UP80-5678', 
          driver_name: 'Demo Driver 2',
          latitude: 27.5142,
          longitude: 77.6739,
          route_id: '2',
          status: 'active'
        }
      ]

      setBuses(mockBuses)
    } catch (err) {
      console.error('Error fetching buses:', err)
      setBuses([])
    }
  }

  // Load buses when component mounts
  useEffect(() => {
    fetchCurrentBuses()
  }, [])

  const handleStopClick = (stop) => {
    setSelectedStop(stop)
    setBottomSheetOpen(true)
  }

  const handleCloseBottomSheet = () => {
    setBottomSheetOpen(false)
    setSelectedStop(null)
    setRoutePolyline(null)
    setRouteWaypoints([])
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div style={{ fontSize: '24px' }}>🗺️</div>
        <h3 style={{ margin: '16px 0 8px', fontWeight: 'bold' }}>Finding nearby stops...</h3>
        <p style={{ color: '#666', textAlign: 'center' }}>
          We're locating bus stops around you. This may take a moment.
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div style={{ fontSize: '24px', color: '#f44336' }}>⚠️</div>
        <h3 style={{ margin: '16px 0 8px', fontWeight: 'bold', color: '#f44336' }}>Error</h3>
        <p style={{ color: '#666', textAlign: 'center' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            marginTop: '16px',
            padding: '8px 16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Map updater component */}
        <MapUpdater 
          center={center} 
          buses={buses}
          mapRef={mapRef}
          routePolyline={routePolyline}
          routeWaypoints={routeWaypoints}
        />

        {/* Bus markers */}
        {buses.map((bus) => (
          <Marker 
            key={bus.id} 
            position={[bus.latitude, bus.longitude]} 
            icon={busIcon}
          >
            <Popup>
              <div style={{ padding: '8px' }}>
                <h4 style={{ margin: '0 0 8px', fontWeight: 'bold' }}>
                  Bus {bus.vehicle_number}
                </h4>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                  Driver: {bus.driver_name}
                </p>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                  Status: {bus.status}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Stop markers */}
        {nearbyStops.map((stop) => (
          <Marker 
            key={stop.id} 
            position={[stop.latitude, stop.longitude]} 
            icon={stopIcon}
            eventHandlers={{
              click: () => handleStopClick(stop)
            }}
          >
            <Popup>
              <div style={{ padding: '8px' }}>
                <h4 style={{ margin: '0 0 8px', fontWeight: 'bold' }}>
                  {stop.name}
                </h4>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                  Route: {stop.route_name}
                </p>
                {stop.distance && (
                  <p style={{ margin: '4px 0', fontSize: '14px' }}>
                    Distance: {stop.distance}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Route polyline if available */}
        {routePolyline && (
          <Polyline 
            positions={routePolyline} 
            color="#2196F3" 
            weight={4} 
            opacity={0.7}
          />
        )}
      </MapContainer>

      {/* Floating info panel */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        fontSize: '14px',
        zIndex: 1000
      }}>
        <div style={{ marginBottom: '4px' }}>
          <span>🚏 {nearbyStops.length} stops nearby</span>
        </div>
        <div>
          <span>🚌 {buses.length} buses active</span>
        </div>
      </div>

      {/* Bottom Sheet */}
      <BottomSheet
        isOpen={bottomSheetOpen}
        onClose={handleCloseBottomSheet}
        title={selectedStop?.name || 'Bus Stop'}
      >
        {selectedStop && (
          <div style={{ padding: '16px' }}>
            <h3 style={{ margin: '0 0 16px', fontWeight: 'bold' }}>
              {selectedStop.name}
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 'bold' }}>
                Route Information
              </h4>
              <p style={{ margin: '4px 0', color: '#666' }}>
                Route: {selectedStop.route_name}
              </p>
              {selectedStop.distance && (
                <p style={{ margin: '4px 0', color: '#666' }}>
                  Distance: {selectedStop.distance}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 'bold' }}>
                Next Arrivals
              </h4>
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, color: '#666' }}>
                  Real-time arrival information coming soon
                </p>
              </div>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  )
}

export default Map
