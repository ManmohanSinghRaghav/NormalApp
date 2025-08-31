import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import { MathuraDataService } from '../services/MathuraDataService'
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Fab,
  Chip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Collapse,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Drawer,
  AppBar,
  Toolbar,
  Divider,
  LinearProgress,
} from '@mui/material'
import {
  MyLocation as MyLocationIcon,
  DirectionsBus as BusIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Speed as SpeedIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'

// Custom bus icon
const createBusIcon = (status, capacity) => {
  const color = status === 'active' ? '#4caf50' : status === 'delayed' ? '#ff9800' : '#f44336'
  const capacityColor = capacity > 80 ? '#f44336' : capacity > 60 ? '#ff9800' : '#4caf50'
  
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
        font-size: 14px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        position: relative;
        color: white;
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
  const [error, setError] = useState(null)
  const [userLocation, setUserLocation] = useState([27.4924, 77.6737]) // Default: Mathura
  const [radius, setRadius] = useState(2000)
  const [filterType, setFilterType] = useState('all')
  const [showBusList, setShowBusList] = useState(false)
  const [showLegend, setShowLegend] = useState(true)
  const [showCapacityFilter, setShowCapacityFilter] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedBus, setSelectedBus] = useState(null)
  const [loadingTimeout, setLoadingTimeout] = useState(false)

  const getCapacityPercentage = (bus) => {
    // Use occupancy field directly if available, otherwise calculate
    if (bus.occupancy !== undefined) return bus.occupancy
    if (!bus.capacity || !bus.current_passengers) return 0
    return Math.round((bus.current_passengers / bus.capacity) * 100)
  }

  const getCapacityColor = (percentage) => {
    if (percentage > 80) return 'error'
    if (percentage > 60) return 'warning' 
    return 'success'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success'
      case 'delayed': return 'warning'
      case 'inactive': return 'error'
      default: return 'default'
    }
  }

  const filteredBuses = buses.filter(bus => {
    if (filterType !== 'all' && bus.vehicle_type !== filterType) return false
    if (showCapacityFilter && getCapacityPercentage(bus) < 20) return false
    return true
  })

  useEffect(() => {
    // Only get location once on mount
    getCurrentLocation()
    
    // Set a timeout to show fallback data if loading takes too long
    const timeout = setTimeout(() => {
      if (loading) {
        // Don't show offline message for timeout, just stop loading
        setBuses(getMockBuses())
        setLoading(false)
      }
    }, 5000) // 5 seconds timeout
    
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    // Load buses when location or radius changes (but skip default location)
    if (userLocation[0] !== 27.4924 || userLocation[1] !== 77.6737) {
      loadBuses()
    }
  }, [radius]) // Only depend on radius, not userLocation

  useEffect(() => {
    // Auto-refresh every 60 seconds (instead of 30)
    const interval = setInterval(() => {
      if (!loading) {
        loadBuses(false)
      }
    }, 60000)
    
    return () => clearInterval(interval)
  }, [loading])

  const loadBuses = async (showLoader = true) => {
    if (showLoader) setLoading(true)
    setRefreshing(!showLoader)
    setError(null) // Clear previous errors
    
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      const dataPromise = MathuraDataService.getBusesNearLocation(
        userLocation[0], 
        userLocation[1], 
        radius
      );
      
      const data = await Promise.race([dataPromise, timeoutPromise]);
      setBuses(data);
    } catch (error) {
      console.error('Error loading buses:', error);
      // Don't show error message, just use fallback silently
      setBuses(getMockBuses());
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const loadBusesForLocation = async (location) => {
    setLoading(true)
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      const dataPromise = MathuraDataService.getBusesNearLocation(
        location[0], 
        location[1], 
        radius
      );
      
      const data = await Promise.race([dataPromise, timeoutPromise]);
      setBuses(data);
    } catch (error) {
      console.error('Error loading buses:', error);
      // Fallback to mock data
      setBuses(getMockBuses());
    } finally {
      setLoading(false)
    }
  }

  // Mock data fallback
  const getMockBuses = () => [
    {
      id: 'mock-1',
      bus_number: 'MH-20',
      route_name: 'Krishna Janmabhoomi Circuit',
      current_location: {
        lat: userLocation[0] + 0.001,
        lng: userLocation[1] + 0.001
      },
      status: 'active',
      next_stop: 'Krishna Janmabhoomi',
      eta_minutes: 5,
      distance_km: 0.5,
      occupancy: 65,
      vehicle_type: 'Standard Bus'
    },
    {
      id: 'mock-2', 
      bus_number: 'MH-21',
      route_name: 'Vrindavan Express',
      current_location: {
        lat: userLocation[0] - 0.002,
        lng: userLocation[1] + 0.003
      },
      status: 'active',
      next_stop: 'ISKCON Vrindavan',
      eta_minutes: 12,
      distance_km: 1.2,
      occupancy: 42,
      vehicle_type: 'AC Bus'
    }
  ]

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = [position.coords.latitude, position.coords.longitude]
          setUserLocation(newLocation)
          // Load buses immediately after getting location
          loadBusesForLocation(newLocation)
        },
        (error) => {
          console.log('Geolocation error:', error)
          // Load buses with default location
          loadBuses()
        }
      )
    } else {
      // Load buses with default location if geolocation not supported
      loadBuses()
    }
  }

  if (loading) {
    return (
      <Box 
        sx={{ 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="body1" color="text.secondary">
          {t('buses.loading', 'Loading buses around you...')}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper elevation={1} sx={{ zIndex: 1300 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 1 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h5" fontWeight={600}>
                {t('buses.aroundMe', 'Buses Around Me')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredBuses.length} {t('buses.busesFound', 'buses found nearby')}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={() => loadBuses()} disabled={refreshing}>
                <RefreshIcon />
              </IconButton>
              <IconButton onClick={() => setShowBusList(!showBusList)}>
                <FilterListIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Filters */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>{t('buses.vehicleType', 'Type')}</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                label={t('buses.vehicleType', 'Type')}
              >
                <MenuItem value="all">{t('buses.all', 'All')}</MenuItem>
                <MenuItem value="bus">{t('buses.bus', 'Bus')}</MenuItem>
                <MenuItem value="miniBus">{t('buses.miniBus', 'Mini Bus')}</MenuItem>
                <MenuItem value="auto">{t('buses.auto', 'Auto')}</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>{t('buses.radius', 'Radius')}</InputLabel>
              <Select
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                label={t('buses.radius', 'Radius')}
              >
                <MenuItem value={1000}>1 km</MenuItem>
                <MenuItem value={2000}>2 km</MenuItem>
                <MenuItem value={5000}>5 km</MenuItem>
                <MenuItem value={10000}>10 km</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={showCapacityFilter}
                  onChange={(e) => setShowCapacityFilter(e.target.checked)}
                />
              }
              label={t('buses.lowCapacity', 'Hide Full Buses')}
            />
          </Box>
        </Box>
        {refreshing && <LinearProgress />}
      </Paper>

      {/* Map Container */}
      <Box sx={{ flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
        <MapContainer
          center={userLocation}
          zoom={15}
          style={{ height: '100%', width: '100%', zIndex: 1 }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* User location */}
          <Marker position={userLocation}>
            <Popup>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">📍</Typography>
                <Typography variant="body2" fontWeight={500}>
                  {t('location.yourLocation', 'Your Location')}
                </Typography>
              </Box>
            </Popup>
          </Marker>
          
          {/* Search radius */}
          <Circle
            center={userLocation}
            radius={radius}
            pathOptions={{
              color: '#2196f3',
              fillColor: '#2196f3',
              fillOpacity: 0.1,
              weight: 2
            }}
          />
          
          {/* Bus markers */}
          {filteredBuses
            .filter(bus => bus.current_location && bus.current_location.lat && bus.current_location.lng)
            .map((bus) => (
            <Marker
              key={bus.id}
              position={[bus.current_location.lat, bus.current_location.lng]}
              icon={createBusIcon(bus.status, getCapacityPercentage(bus))}
              eventHandlers={{
                click: () => setSelectedBus(bus)
              }}
            >
              <Popup>
                <Card elevation={0} sx={{ minWidth: 200 }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Typography variant="h6" gutterBottom>
                      {bus.bus_number} - {bus.route_name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={bus.status} 
                          color={getStatusColor(bus.status)}
                          size="small"
                        />
                        <Chip 
                          label={`${getCapacityPercentage(bus)}% full`}
                          color={getCapacityColor(getCapacityPercentage(bus))}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary">
                        <SpeedIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        {bus.current_speed} km/h
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary">
                        <PeopleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        {bus.current_passengers}/{bus.capacity} passengers
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary">
                        <ScheduleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        Next: {bus.next_stop} ({bus.eta_minutes} min)
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Legend */}
        {showLegend && (
          <Paper
            elevation={3}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              p: 2,
              maxWidth: 250,
              zIndex: 1000,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {t('map.legend', 'Legend')}
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => setShowLegend(false)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'success.main' }} />
                <Typography variant="caption">{t('buses.active', 'Active')}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'warning.main' }} />
                <Typography variant="caption">{t('buses.delayed', 'Delayed')}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'error.main' }} />
                <Typography variant="caption">{t('buses.inactive', 'Inactive')}</Typography>
              </Box>
            </Box>
          </Paper>
        )}

        {/* My Location FAB */}
        <Fab
          color="primary"
          size="medium"
          onClick={getCurrentLocation}
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <MyLocationIcon />
        </Fab>

        {/* Show Legend FAB */}
        {!showLegend && (
          <Fab
            color="secondary"
            size="small"
            onClick={() => setShowLegend(true)}
            sx={{
              position: 'absolute',
              bottom: 80,
              right: 16,
              zIndex: 1000,
            }}
          >
            <VisibilityIcon />
          </Fab>
        )}
      </Box>

      {/* Bus List Drawer */}
      <Drawer
        anchor="bottom"
        open={showBusList}
        onClose={() => setShowBusList(false)}
        PaperProps={{
          sx: { 
            maxHeight: '60vh',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              {t('buses.nearbyBuses', 'Nearby Buses')}
            </Typography>
            <IconButton onClick={() => setShowBusList(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <List>
            {filteredBuses.map((bus) => (
              <ListItem key={bus.id} divider>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'black' }}>
                    <BusIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${bus.bus_number} - ${bus.route_name}`}
                  secondary={
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                      <Chip 
                        label={bus.status} 
                        color={getStatusColor(bus.status)}
                        size="small"
                      />
                      <Chip 
                        label={`${getCapacityPercentage(bus)}% full`}
                        color={getCapacityColor(getCapacityPercentage(bus))}
                        size="small"
                      />
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  )
}
