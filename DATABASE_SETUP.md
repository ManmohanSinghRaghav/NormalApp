# Database Setup for Real-Time Data

## Current Issue
The app is showing mock data because the Supabase database tables are not yet created or populated with data.

## Steps to Enable Real-Time Data

### 1. Create Database Schema
Run the following SQL files in your Supabase SQL Editor (in order):

```sql
-- 1. First run: complete_schema.sql
-- This creates all tables: routes, waypoints, buses, drivers, trips
```

### 2. Insert Sample Data
```sql
-- 2. Then run: mathura_sample_data.sql  
-- This inserts realistic Mathura bus routes and stops
```

### 3. Create Sample Buses
Run this SQL to create active buses with current locations:

```sql
-- Insert sample buses
INSERT INTO public.buses (vehicle_number, route_id, status, latitude, longitude, driver_name, vehicle_type) VALUES
('MH-20-B-1001', (SELECT id FROM routes WHERE name = 'Krishna Temple Circuit' LIMIT 1), 'active', 27.5036, 77.6737, 'Rajesh Kumar', 'Standard Bus'),
('MH-20-B-1002', (SELECT id FROM routes WHERE name = 'Ghat Express' LIMIT 1), 'active', 27.5067, 77.6789, 'Amit Singh', 'AC Bus'),
('MH-20-B-1003', (SELECT id FROM routes WHERE name = 'University Express' LIMIT 1), 'active', 27.4898, 77.6698, 'Suresh Yadav', 'Mini Bus'),
('MH-20-B-1004', (SELECT id FROM routes WHERE name = 'Station Link' LIMIT 1), 'active', 27.4850, 77.6690, 'Vikram Sharma', 'Standard Bus'),
('MH-20-B-1005', (SELECT id FROM routes WHERE name = 'Medical Circuit' LIMIT 1), 'active', 27.4823, 77.6634, 'Ravi Gupta', 'AC Bus');

-- Update bus locations to simulate movement
UPDATE public.buses SET 
  latitude = latitude + (random() - 0.5) * 0.005,
  longitude = longitude + (random() - 0.5) * 0.005,
  last_updated = NOW()
WHERE status = 'active';
```

### 4. Verify Database Connection
Check your Supabase project settings:

1. **Project URL**: Make sure `supabaseClient.js` has the correct URL
2. **API Key**: Ensure you're using the public anon key
3. **RLS Policies**: The tables need to be accessible (disable RLS for testing or create proper policies)

### 5. Disable Row Level Security (for testing)
```sql
-- Temporarily disable RLS to test data access
ALTER TABLE public.routes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.waypoints DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.buses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips DISABLE ROW LEVEL SECURITY;
```

## What This Will Fix

✅ **Remove "Using offline data" message**
✅ **Show real bus locations on map**  
✅ **Display actual Mathura bus stops**
✅ **Live bus tracking data**
✅ **Real route information**

## Expected Results After Setup

- **Bus Stops Near Me**: Will show actual Mathura bus stops like Krishna Janmabhoomi, Vishram Ghat, etc.
- **Buses Around Me**: Will display real buses with vehicle numbers like MH-20-B-1001, driver names, and live locations
- **No more mock data messages**
- **Real-time updates**

## Files to Execute (in order)

1. `sql/complete_schema.sql` - Creates all tables
2. `sql/mathura_sample_data.sql` - Inserts routes and stops  
3. The bus insertion SQL above - Creates active buses
4. The RLS disable SQL above - Allows data access

## Troubleshooting

If you still see mock data after setup:
1. Check browser console for Supabase errors
2. Verify tables exist in Supabase dashboard
3. Check if data was inserted successfully
4. Ensure RLS is disabled or policies are set correctly

The app will automatically switch to real data once the database is properly set up!
