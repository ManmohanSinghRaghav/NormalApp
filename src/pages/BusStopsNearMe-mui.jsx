import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
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
  Drawer,
  TextField,
  InputAdornment,
  CircularProgress,
  Rating,
  Divider,
  Button,
} from '@mui/material'
import {
  MyLocation as MyLocationIcon,
  LocationOn as StopIcon,
  Search as SearchIcon,
  DirectionsBus as BusIcon,
  Star as StarIcon,
  People as PeopleIcon,
  Accessible as AccessibleIcon,
  LocalParking as ParkingIcon,
  Wc as WcIcon,
  Close as CloseIcon,
  Navigation as NavigationIcon,
} from '@mui/icons-material'

// Custom stop icon
const createStopIcon = (crowdLevel, amenities = {}) => {
  const crowdColors = {
    low: '#4caf50',
    medium: '#ff9800', 
    high: '#f44336'
  }
  
  const color = crowdColors[crowdLevel] || '#757575'
  
  return new L.DivIcon({
    html: `
      <div style="
        background: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        position: relative;
        color: white;
      ">
        🚏
        ${amenities.wheelchair ? '<div style="position: absolute; top: -2px; right: -2px; font-size: 8px;">♿</div>' : ''}
      </div>
    `,
    className: 'custom-stop-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  })
}

export default function BusStopsNearMe() {
  const { t } = useTranslation()
  const [stops, setStops] = useState([])
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState([27.4924, 77.6737]) // Default: Mathura
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStop, setSelectedStop] = useState(null)
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const [radius, setRadius] = useState(2000)

  const getCrowdLevelColor = (level) => {
    switch (level) {
      case 'low': return 'success'
      case 'medium': return 'warning'
      case 'high': return 'error'
      default: return 'default'
    }
  }

  const filteredStops = stops.filter(stop =>
    stop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stop.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    loadStops()
    getCurrentLocation()
  }, [userLocation, radius])

  const loadStops = async () => {
    setLoading(true)
    try {
      const data = await MathuraDataService.getStopsNearLocation(
        userLocation[0], 
        userLocation[1], 
        radius
      )
      setStops(data)
    } catch (error) {
      console.error('Error loading stops:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.log('Geolocation error:', error)
        }
      )
    }
  }

  const handleStopClick = (stop) => {
    setSelectedStop(stop)
    setShowBottomSheet(true)
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
          {t('stops.loading', 'Loading bus stops around you...')}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header with Search */}
      <Paper elevation={1} sx={{ zIndex: 1300 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {t('stops.nearMe', 'Bus Stops Near Me')}
          </Typography>
          
          <TextField
            fullWidth
            size="small"
            placeholder={t('stops.searchPlaceholder', 'Search bus stops...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {filteredStops.length} {t('stops.stopsFound', 'stops found nearby')}
          </Typography>
        </Box>
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
          
          {/* Stop markers */}
          {filteredStops.map((stop) => (
            <Marker
              key={stop.id}
              position={[stop.latitude, stop.longitude]}
              icon={createStopIcon(stop.crowdLevel, stop.amenities)}
              eventHandlers={{
                click: () => handleStopClick(stop)
              }}
            >
              <Popup>
                <Card elevation={0} sx={{ minWidth: 200 }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Typography variant="h6" gutterBottom>
                      {stop.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {stop.address}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={`${stop.crowdLevel} crowd`}
                          color={getCrowdLevelColor(stop.crowdLevel)}
                          size="small"
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                          <Typography variant="caption">{stop.rating}</Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary">
                        {stop.distance}m away
                      </Typography>
                      
                      {stop.amenities && (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {stop.amenities.wheelchair && <AccessibleIcon fontSize="small" />}
                          {stop.amenities.parking && <ParkingIcon fontSize="small" />}
                          {stop.amenities.restroom && <WcIcon fontSize="small" />}
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

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
      </Box>

      {/* Bottom Sheet */}
      <Drawer
        anchor="bottom"
        open={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        PaperProps={{
          sx: { 
            maxHeight: '60vh',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }
        }}
      >
        {selectedStop && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight={600}>
                  {selectedStop.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedStop.address}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {selectedStop.distance}m away
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                    <Typography variant="body2">{selectedStop.rating}</Typography>
                  </Box>
                  <Chip 
                    label={`${selectedStop.crowdLevel} crowd`}
                    color={getCrowdLevelColor(selectedStop.crowdLevel)}
                    size="small"
                  />
                </Box>
              </Box>
              
              <IconButton onClick={() => setShowBottomSheet(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Amenities */}
            {selectedStop.amenities && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  {t('stops.amenities', 'Amenities')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedStop.amenities.wheelchair && (
                    <Chip 
                      icon={<AccessibleIcon />} 
                      label={t('stops.wheelchair', 'Wheelchair Accessible')} 
                      size="small" 
                    />
                  )}
                  {selectedStop.amenities.parking && (
                    <Chip 
                      icon={<ParkingIcon />} 
                      label={t('stops.parking', 'Parking Available')} 
                      size="small" 
                    />
                  )}
                  {selectedStop.amenities.restroom && (
                    <Chip 
                      icon={<WcIcon />} 
                      label={t('stops.restroom', 'Restroom')} 
                      size="small" 
                    />
                  )}
                </Box>
              </Box>
            )}

            {/* Buses at this stop */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                {t('stops.busesAtStop', 'Buses at this stop')}
              </Typography>
              
              {selectedStop.buses && selectedStop.buses.length > 0 ? (
                <List dense>
                  {selectedStop.buses.map((bus, index) => (
                    <ListItem key={index} divider>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'black', width: 32, height: 32 }}>
                          <BusIcon fontSize="small" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${bus.route_number} - ${bus.destination}`}
                        secondary={`Next arrival: ${bus.eta} minutes`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('stops.noBuses', 'No buses currently scheduled')}
                </Typography>
              )}
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<NavigationIcon />}
                fullWidth
                onClick={() => {
                  // Open navigation app
                  window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedStop.latitude},${selectedStop.longitude}`)
                }}
              >
                {t('stops.getDirections', 'Get Directions')}
              </Button>
              <Button
                variant="contained"
                startIcon={<StarIcon />}
                onClick={() => {
                  // Add to favorites functionality
                  console.log('Add to favorites:', selectedStop.id)
                }}
              >
                {t('stops.favorite', 'Favorite')}
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  )
}
