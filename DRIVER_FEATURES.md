# NextStop Driver Features - Implementation Guide

This guide covers the complete driver experience implementation including authentication, application process, and dashboard functionality.

## ✅ Completed Driver Features

### Step 4.1: Driver Authentication Forms ✅
- **DriverLoginPage.jsx**: Professional login interface with driver-specific validation
- **DriverSignupPage.jsx**: Driver registration with basic information collection
- **Status-based Routing**: Automatic redirection based on driver application status

### Step 4.2: Driver Application Form ✅
- **DriverApplicationPage.jsx**: Comprehensive application form with document upload
- **Document Storage**: Secure file upload to Supabase Storage
- **Status Management**: Updates driver status from 'pending' to 'review'
- **Pre-fill Support**: Resumes partially completed applications

### Step 4.3: Driver Dashboard ✅
- **DriverDashboard.jsx**: Complete dashboard with vehicle, route, and trip information
- **Real-time Data**: Live updates from database
- **Status Monitoring**: Track driver approval status and vehicle assignment

### Step 4.4: Trip Management ✅
- **Start/End Trip Buttons**: Interactive trip control with status updates
- **RPC Functions**: Secure PostgreSQL functions for trip state management
- **Real-time Updates**: Live trip status changes visible across the system

## Database Schema

### Driver Tables Created

```sql
-- Drivers table with complete application data
CREATE TABLE drivers (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  license_number TEXT,
  license_expiry_date DATE,
  vehicle_number TEXT,
  vehicle_type TEXT,
  vehicle_model TEXT,
  vehicle_year INTEGER,
  address TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  experience TEXT,
  documents JSONB,
  status TEXT DEFAULT 'pending', -- pending, review, approved, rejected, suspended
  application_submitted_at TIMESTAMP,
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Trips table for schedule management
CREATE TABLE trips (
  id UUID PRIMARY KEY,
  route_id UUID REFERENCES routes(id),
  bus_id UUID REFERENCES buses(id),
  scheduled_start_time TIMESTAMP NOT NULL,
  scheduled_end_time TIMESTAMP NOT NULL,
  actual_start_time TIMESTAMP,
  actual_end_time TIMESTAMP,
  status TEXT DEFAULT 'scheduled', -- scheduled, active, completed, cancelled
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Trip logs for event tracking
CREATE TABLE trip_logs (
  id UUID PRIMARY KEY,
  trip_id UUID REFERENCES trips(id),
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Driver Application Flow

### 1. Registration Process
```javascript
// Driver signs up and creates account with 'pending' status
const { data: authData } = await supabase.auth.signUp({ email, password })
await supabase.from('drivers').insert([{
  user_id: authData.user.id,
  full_name: formData.fullName,
  phone_number: formData.phoneNumber,
  status: 'pending'
}])
```

### 2. Application Submission
```javascript
// Driver completes application form
const updateData = {
  license_number: formData.licenseNumber,
  vehicle_number: formData.vehicleNumber,
  // ... other application data
  status: 'review',
  application_submitted_at: new Date().toISOString()
}
await supabase.from('drivers').update(updateData).eq('user_id', user.id)
```

### 3. Admin Approval (Manual Process)
```sql
-- Admin approves driver application
UPDATE drivers 
SET status = 'approved', approved_at = NOW() 
WHERE id = 'driver_id';

-- Admin assigns bus to driver
UPDATE buses 
SET driver_id = 'driver_id'
WHERE vehicle_number = 'UP80-1234';
```

## Trip Management System

### RPC Functions Created

#### start_trip(trip_id)
- Changes trip status from 'scheduled' to 'active'
- Updates bus status to 'active'
- Records trip start time
- Logs the event for tracking

#### end_trip(trip_id)
- Changes trip status from 'active' to 'completed'
- Updates bus status to 'inactive'
- Records trip end time
- Logs the completion event

#### update_bus_location(bus_id, lat, lng)
- Updates bus GPS coordinates
- Logs location changes during active trips
- Triggers real-time updates for passengers

### Usage in Driver Dashboard
```javascript
// Start a trip
const { error } = await supabase.rpc('start_trip', { trip_id: trip.id })

// End a trip
const { error } = await supabase.rpc('end_trip', { trip_id: trip.id })
```

## Real-time Features

### Live Trip Updates
```javascript
// Dashboard subscribes to trip changes
const subscription = supabase
  .from('trips')
  .on('UPDATE', payload => {
    // Update UI when trip status changes
    updateTripStatus(payload.new)
  })
  .subscribe()
```

### Bus Location Tracking
```javascript
// Bus location updates trigger passenger map updates
const busSubscription = supabase
  .from('buses')
  .on('UPDATE', payload => {
    // Passenger map shows real-time bus movement
    updateBusPosition(payload.new)
  })
  .subscribe()
```

## File Structure

```
src/pages/driver/
├── DriverLanding.jsx         # Landing page with registration links
├── DriverLoginPage.jsx       # Driver-specific login
├── DriverSignupPage.jsx      # Driver registration
├── DriverApplicationPage.jsx # Complete application form
└── DriverDashboard.jsx       # Main driver interface

sql/
├── complete_schema.sql           # Full database schema
├── trip_management_functions.sql # RPC functions for trip control
└── driver_sample_data.sql        # Test data for development
```

## Security Features

### Row Level Security (RLS)
- Drivers can only access their own records
- Trip data is filtered by driver ownership
- Document uploads are user-specific

### Authentication Flow
- Email/password authentication via Supabase Auth
- Driver status verification before dashboard access
- Automatic routing based on application state

## Document Upload System

### Supabase Storage Integration
```javascript
// Upload driver documents
const { data, error } = await supabase.storage
  .from('driver-documents')
  .upload(`${user.id}/license.jpg`, file)
```

### Supported Documents
- Driving License
- Vehicle Registration
- Vehicle Insurance
- Profile Photo

## Testing the Driver Features

### 1. Set Up Database
```sql
-- Run these files in Supabase SQL Editor:
-- 1. sql/complete_schema.sql
-- 2. sql/get_stops_near_me.sql
-- 3. sql/trip_management_functions.sql
-- 4. sql/driver_sample_data.sql
```

### 2. Test Driver Registration
1. Visit `/driver/signup`
2. Fill out registration form
3. Check email for verification
4. Login at `/driver/login`
5. Complete application at `/driver/application`

### 3. Test Trip Management
1. Admin approves driver in database
2. Admin assigns bus to driver
3. Driver logs in to dashboard
4. Driver starts/ends trips using buttons

## Integration Points

### With Passenger App
- Real-time bus locations update passenger map
- Trip schedules affect passenger route information
- Driver status affects bus availability

### With Admin System (Future)
- Driver application approval workflow
- Bus assignment management
- Route scheduling interface

## Performance Optimizations

### Database Indexes
- Spatial indexes on GPS coordinates
- Status indexes for quick filtering
- Relationship indexes for joins

### Real-time Efficiency
- Filtered subscriptions by driver/route
- Batched location updates
- Optimized trip queries

## Deployment Considerations

### Environment Variables
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Storage Bucket Setup
- Create 'driver-documents' bucket in Supabase
- Configure appropriate access policies
- Set file size and type restrictions

The driver experience is now fully functional and ready for testing. The system supports the complete driver lifecycle from registration through daily trip management.
