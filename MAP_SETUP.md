# NextStop - Core Passenger Map Experience Setup

This guide covers the implementation of the core passenger map experience with real-time bus tracking.

## Features Implemented

### ✅ Step 3.1: Main UI Layout
- **Layout Component**: Clean mobile-first design with top bar and bottom navigation
- **Top Bar**: Displays selected city from localStorage with user menu
- **Bottom Navigation**: Map, Routes, Favorites, and Profile tabs
- **Authentication**: Automatic routing based on login status

### ✅ Step 3.2: "Stops Near Me" RPC Function
- **PostgreSQL Function**: Efficient geospatial queries using PostGIS
- **Fallback Function**: Simple haversine formula for basic setups
- **Performance Optimized**: Returns only nearby stops within specified radius

### ✅ Step 3.3: Basic "Stops Near Me" Map
- **Interactive Map**: Using React Leaflet with OpenStreetMap tiles
- **Geolocation**: Automatic user location detection
- **Stop Markers**: Custom icons for bus stops with route information
- **Error Handling**: Graceful fallbacks and user feedback

### ✅ Step 3.4: Real-Time "Buses Around Me" Map
- **Live Bus Tracking**: Supabase Realtime subscriptions
- **Smooth Animation**: Buses move smoothly between location updates
- **Custom Markers**: Distinct icons for buses and stops
- **Status Display**: Real-time count of active buses and nearby stops

## Database Setup

### 1. Create Database Schema
Run this SQL in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of sql/schema.sql
```

### 2. Create the RPC Function
Run this SQL in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of sql/get_stops_near_me.sql
```

### 3. Insert Sample Data (Optional)
For testing purposes, run:

```sql
-- Copy and paste the contents of sql/sample_data.sql
```

## Environment Setup

Make sure you have the following environment variables in your `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Key Components

### Layout.jsx
- Mobile-optimized layout with responsive design
- Integrated user authentication with logout functionality
- Location badge from onboarding
- Bottom navigation for future features

### Map.jsx
- Real-time map with bus and stop tracking
- Geolocation integration with fallback handling
- Custom markers and popups with relevant information
- Automatic updates via Supabase Realtime

### Dashboard.jsx
- Main authenticated user interface
- Combines Layout and Map components

### useAuth.jsx
- Authentication context provider
- Handles login state and session management
- Provides logout functionality

## Real-Time Features

### Bus Location Updates
```javascript
// Buses update their location and the map receives real-time updates
const subscription = supabase
  .from('buses')
  .on('UPDATE', payload => {
    // Smooth animation to new position
    updateBusPosition(payload.new)
  })
  .subscribe()
```

### Location-Based Stop Search
```javascript
// Efficient radius-based search
const { data } = await supabase.rpc('get_stops_near_me', {
  user_lat: userLocation.lat,
  user_lng: userLocation.lng,
  radius_km: 5
})
```

## Mobile Optimization

- **Full viewport height**: Map takes entire screen space
- **Touch-friendly**: Large buttons and markers for mobile interaction
- **Responsive design**: Adapts to different screen sizes
- **Minimal UI**: Clean interface focused on map functionality

## Error Handling

- **Geolocation fallback**: Default to city center if location unavailable
- **RPC function fallback**: Alternative queries if PostGIS unavailable
- **Network resilience**: Graceful handling of connection issues
- **User feedback**: Clear error messages and retry options

## Next Steps

1. **Set up database**: Create tables and functions using provided SQL files
2. **Configure environment**: Add Supabase credentials to `.env.local`
3. **Test functionality**: Create sample data and test real-time updates
4. **Customize**: Adjust colors, icons, and layout to match your brand

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Dependencies Added

- `react-leaflet`: Map rendering and interaction
- `leaflet`: Core mapping library
- `@supabase/supabase-js`: Database and real-time subscriptions

The core passenger map experience is now ready for testing and can be extended with additional features like route planning, favorites, and notifications.
