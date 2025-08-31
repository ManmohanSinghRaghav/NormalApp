# Mathura Bus System Setup Guide

This guide will help you set up the complete Mathura Bus Tracking System with real data integration.

## 🗄️ Database Setup

### 1. Initialize the Schema
```sql
-- Run this in your Supabase SQL editor or psql
\i sql/complete_schema.sql
```

### 2. Load Mathura Sample Data
```sql
-- Load the Mathura-specific routes, buses, and drivers
\i sql/mathura_sample_data.sql
```

### 3. Install Database Functions
```sql
-- Install geo-query and analytics functions
\i sql/mathura_functions.sql
```

## 🚀 Application Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Start Development Server
```bash
npm run dev
```

## 📊 Data Verification

### Test the Integration
```bash
# Run the integration tests
node src/test-integration.js
```

### Expected Data:
- **6 Bus Routes**: Krishna Temple Circuit, Ghat Express, University Express, Station Link, Medical Circuit, Bazaar Express
- **14 Buses**: Various vehicle types (bus, miniBus, auto) assigned to routes
- **8 Drivers**: Mix of approved and pending drivers
- **Sample Trips**: Scheduled for today with real timing
- **Geo Functions**: For real-time location queries

## 🗺️ Key Features Integrated

### 1. Real-Time Bus Tracking
- Live bus locations on map
- Distance-based filtering
- Vehicle type filtering
- Driver information display

### 2. Smart Stop Discovery
- Find stops near user location
- Route information for each stop
- Arrival/departure times
- Amenities information

### 3. Intelligent Search
- Search buses by number or driver
- Search routes by name or location
- Search stops by name
- Filter by type (buses/routes/stops)

### 4. Driver Management
- Application submission system
- Dashboard with trip information
- Performance tracking
- Route assignments

### 5. Mathura-Specific Features
- Temple circuit routes
- Ghat express services
- University connections
- Festival and timing awareness

## 🛠️ Development Workflow

### Add New Routes
1. Insert into `routes` table with proper waypoints JSON
2. Assign buses to the route
3. Create driver assignments
4. Test with `MathuraDataService.getActiveRoutes()`

### Add New Buses
1. Insert into `buses` table with current_location
2. Assign driver from `drivers` table
3. Update route assignments
4. Test with location queries

### Test Real-Time Features
1. Use `update_bus_location()` function to simulate movement
2. Check real-time subscriptions
3. Verify map updates
4. Test distance calculations

## 📱 Mobile Features

### Geolocation
- Automatic user location detection
- Fallback to Mathura center (27.4924, 77.6737)
- Distance-based bus/stop filtering

### Offline Support
- Service worker for offline routing
- Cached route data
- Progressive web app features

## 🔧 Troubleshooting

### Common Issues

**No buses showing on map:**
- Check if sample data is loaded
- Verify Supabase connection
- Ensure PostGIS extension is enabled
- Check user location permissions

**Search not working:**
- Verify database functions are installed
- Check search queries in browser console
- Ensure route data has proper formatting

**Driver application failing:**
- Check required fields validation
- Verify database permissions
- Look for foreign key constraints

### Debug Commands
```bash
# Check data loading
npm run dev
# Open browser console and run:
window.testMathuraIntegration()

# Check database directly
# In Supabase SQL editor:
SELECT COUNT(*) FROM routes WHERE active = true;
SELECT COUNT(*) FROM buses WHERE active = true;
SELECT COUNT(*) FROM drivers WHERE status = 'approved';
```

## 🎯 Next Steps

### Phase 1: Core Features ✅
- [x] Real-time bus tracking
- [x] Stop discovery
- [x] Route search
- [x] Driver applications
- [x] Mathura sample data

### Phase 2: Enhanced Features 🚧
- [ ] Trip planning and routing
- [ ] Fare calculation
- [ ] Payment integration
- [ ] Push notifications
- [ ] Analytics dashboard

### Phase 3: Advanced Features 📋
- [ ] ML-based arrival predictions
- [ ] Crowd density analysis
- [ ] Dynamic route optimization
- [ ] Multi-language support
- [ ] Accessibility features

## 📞 Support

For issues or questions:
1. Check the browser console for errors
2. Verify Supabase database connection
3. Run integration tests
4. Check GitHub issues/documentation

---

**🕉️ Built for Mathura, the sacred city of Lord Krishna**
*Connecting devotees and locals with efficient, modern transportation*
