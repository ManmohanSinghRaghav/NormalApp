import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import { MathuraDataService } from '../services/MathuraDataService'

// Custom bus icon
const createBusIcon = (status, capacity) => {
  const color = status === 'active' ? '#22c55e' : status === 'delayed' ? '#f59e0b' : '#ef4444'
  const capacityColor = capacity > 80 ? '#ef4444' : capacity > 60 ? '#f59e0b' : '#22c55e'
  
  return new L.DivIcon({
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        position: relative;
      ">
        🚌
        <div style="
          position: absolute;
          bottom: -4px;
          right: -4px;
          background: ${capacityColor};
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
        "></div>
      </div>
    `,
    className: 'custom-bus-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  })
}

export default function BusesAroundMe() {
  const { t } = useTranslation()
  const [buses, setBuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState([27.4924, 77.6737]) // Default: Mathura
  const [selectedBus, setSelectedBus] = useState(null)
  const [radius, setRadius] = useState(2000) // 2km radius
  const [filterType, setFilterType] = useState('all')
  const [showCapacityFilter, setShowCapacityFilter] = useState(false)
  const [showBusList, setShowBusList] = useState(true)
  const [showLegend, setShowLegend] = useState(true)

  // Mock bus data - replace with actual Supabase queries
  const mockBuses = [
    {
      id: '1',
      bus_number: 'MR-12-AB-1234',
      vehicle_type: 'bus',
      current_location: [27.4950, 77.6750],
      status: 'active',
      capacity: 45,
      max_capacity: 50,
      driver_name: 'Rajesh Kumar',
      route_name: 'Krishna Temple Circuit',
      next_stop: 'Vishram Ghat',
      eta: '5 min',
      speed: 25,
      last_updated: new Date().toISOString()
    },
    {
      id: '2',
      bus_number: 'MR-15-CD-5678',
      vehicle_type: 'miniBus',
      current_location: [27.4900, 77.6720],
      status: 'delayed',
      capacity: 28,
      max_capacity: 35,
      driver_name: 'Priya Sharma',
      route_name: 'University Express',
      next_stop: 'Mathura University',
      eta: '12 min',
      speed: 15,
      last_updated: new Date().toISOString()
    },
    {
      id: '3',
      bus_number: 'MR-18-EF-9012',
      vehicle_type: 'bus',
      current_location: [27.4970, 77.6780],
      status: 'active',
      capacity: 52,
      max_capacity: 60,
      driver_name: 'Amit Singh',
      route_name: 'City Center Line',
      next_stop: 'Railway Station',
      eta: '8 min',
      speed: 30,
      last_updated: new Date().toISOString()
    }
  ]

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }

    loadBuses()

    // Set up real-time updates using Supabase subscription
    const subscription = MathuraDataService.subscribeToBusUpdates((payload) => {
      console.log('Bus location updated:', payload)
      loadBuses() // Reload buses when location updates
    })

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  // Load buses data from Supabase
  const loadBuses = async () => {
    setLoading(true)
    try {
      const nearbyBuses = await MathuraDataService.getBusesNearLocation(
        userLocation[0], 
        userLocation[1], 
        radius / 1000 // Convert meters to kilometers
      )

      // Transform data to match component expectations
      const transformedBuses = nearbyBuses.map(bus => ({
        id: bus.id,
        bus_number: bus.bus_number,
        vehicle_type: bus.vehicle_type,
        current_location: [bus.current_location_lat, bus.current_location_lng],
        status: bus.active ? 'active' : 'inactive',
        capacity: Math.floor(Math.random() * 50), // Mock capacity - would need trip data
        max_capacity: bus.vehicle_type === 'bus' ? 60 : bus.vehicle_type === 'miniBus' ? 35 : 10,
        driver_name: bus.driver_name || 'Unknown Driver',
        route_name: bus.route_name || 'Unknown Route',
        next_stop: 'Calculating...', // Would need trip tracking for real next stop
        eta: `${Math.floor(bus.distance_km * 2)} min`, // Rough ETA
        speed: Math.floor(Math.random() * 30) + 15, // Mock speed
        last_updated: new Date().toISOString(),
        distance_km: bus.distance_km,
        rating: bus.driver_rating || 0,
        fuel_efficiency: bus.fuel_efficiency
      }))

      setBuses(transformedBuses)
    } catch (error) {
      console.error('Error loading buses:', error)
      // Fallback to mock data if Supabase fails
      setBuses(mockBuses)
    } finally {
      setLoading(false)
    }
  }

  const filteredBuses = buses.filter(bus => {
    if (filterType === 'all') return true
    return bus.vehicle_type === filterType
  })

  const getCapacityPercentage = (bus) => {
    return Math.round((bus.capacity / bus.max_capacity) * 100)
  }

  const getCapacityColor = (percentage) => {
    if (percentage > 80) return 'text-danger-600 bg-danger-100'
    if (percentage > 60) return 'text-warning-600 bg-warning-100'
    return 'text-success-600 bg-success-100'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success-600 bg-success-100'
      case 'delayed': return 'text-warning-600 bg-warning-100'
      case 'inactive': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('buses.loading', 'Loading buses around you...')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {t('buses.aroundMe', 'Buses Around Me')}
            </h1>
            <p className="text-sm text-gray-600">
              {filteredBuses.length} {t('buses.busesFound', 'buses found nearby')}
            </p>
          </div>
          
          <button
            onClick={() => {
              setBuses([])
              setLoading(true)
              setTimeout(() => {
                setBuses(mockBuses)
                setLoading(false)
              }, 1000)
            }}
            className="p-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { key: 'all', label: 'All Buses', icon: '🚌' },
            { key: 'bus', label: 'Buses', icon: '🚌' },
            { key: 'miniBus', label: 'Mini Buses', icon: '🚐' },
            { key: 'auto', label: 'Auto', icon: '🛺' }
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setFilterType(filter.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filterType === filter.key
                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{filter.icon}</span>
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative overflow-hidden">
        <MapContainer
          center={userLocation}
          zoom={15}
          className="h-full w-full z-10"
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* User location */}
          <Marker position={userLocation}>
            <Popup>
              <div className="text-center">
                <div className="text-lg mb-1">📍</div>
                <div className="font-medium">{t('location.yourLocation', 'Your Location')}</div>
              </div>
            </Popup>
          </Marker>
          
          {/* Search radius */}
          <Circle
            center={userLocation}
            radius={radius}
            pathOptions={{
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 0.1,
              weight: 2
            }}
          />
          
          {/* Bus markers */}
          {filteredBuses.map((bus) => (
            <Marker
              key={bus.id}
              position={bus.current_location}
              icon={createBusIcon(bus.status, getCapacityPercentage(bus))}
              eventHandlers={{
                click: () => setSelectedBus(bus)
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <div className="font-bold text-lg mb-2">{bus.bus_number}</div>
                  <div className="space-y-1 text-sm">
                    <div><strong>Route:</strong> {bus.route_name}</div>
                    <div><strong>Driver:</strong> {bus.driver_name}</div>
                    <div><strong>Next Stop:</strong> {bus.next_stop}</div>
                    <div><strong>ETA:</strong> {bus.eta}</div>
                    <div><strong>Speed:</strong> {bus.speed} km/h</div>
                    <div className="flex items-center gap-2">
                      <strong>Capacity:</strong>
                      <span className={`px-2 py-1 rounded text-xs ${getCapacityColor(getCapacityPercentage(bus))}`}>
                        {bus.capacity}/{bus.max_capacity} ({getCapacityPercentage(bus)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Map Controls */}
        <div className="absolute top-4 left-4 z-40 pointer-events-none">
          <div className="flex flex-col gap-2 pointer-events-auto">
            <button
              onClick={() => setShowLegend(!showLegend)}
              className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-40 pointer-events-auto">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm text-gray-900">{t('buses.legend', 'Legend')}</h4>
              <button
                onClick={() => setShowLegend(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                <span>{t('buses.available', 'Available')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
                <span>{t('buses.delayed', 'Delayed')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-danger-500 rounded-full"></div>
                <span>{t('buses.outOfService', 'Out of Service')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Bus List Overlay */}
        {showBusList && (
          <div className="absolute bottom-20 left-4 right-4 bg-white rounded-lg shadow-lg z-40 pointer-events-auto">
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{t('buses.nearbyBuses', 'Nearby Buses')} ({filteredBuses.length})</h3>
                <button
                  onClick={() => setShowBusList(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100 max-h-32 overflow-y-auto">
              {filteredBuses.length > 0 ? (
                filteredBuses.map((bus) => (
                  <div
                    key={bus.id}
                    onClick={() => setSelectedBus(bus)}
                    className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 text-sm">{bus.bus_number}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bus.status)}`}>
                            {bus.status}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">{bus.route_name}</div>
                        <div className="text-xs text-gray-500">
                          Next: {bus.next_stop} • ETA: {bus.eta}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${getCapacityColor(getCapacityPercentage(bus))}`}>
                          {getCapacityPercentage(bus)}%
                        </div>
                        <div className="text-xs text-gray-500">{bus.speed} km/h</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  {loading ? 'Loading buses...' : 'No buses found in this area'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Toggle Bus List Button */}
        {!showBusList && (
          <button
            onClick={() => setShowBusList(true)}
            className="absolute bottom-20 right-4 bg-primary-600 text-white rounded-full p-3 shadow-lg hover:bg-primary-700 transition-colors z-40"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
          <h4 className="font-semibold text-sm text-gray-900 mb-2">{t('buses.legend', 'Legend')}</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success-500 rounded-full"></div>
              <span>{t('buses.available', 'Available')}</span>
        )}
      </div>
    </div>
  )
}
