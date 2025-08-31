-- Complete database schema for NextStop app including driver tables
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS postgis;

-- Routes table
CREATE TABLE IF NOT EXISTS routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Waypoints (bus stops) table
CREATE TABLE IF NOT EXISTS waypoints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  sequence_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
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
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'review', 'approved', 'rejected', 'suspended')),
  application_submitted_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Buses table (updated to include driver relationship)
CREATE TABLE IF NOT EXISTS buses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id UUID REFERENCES routes(id) ON DELETE SET NULL,
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  vehicle_number TEXT UNIQUE NOT NULL,
  vehicle_type TEXT DEFAULT 'bus',
  vehicle_model TEXT,
  driver_name TEXT, -- Keep for backward compatibility
  status TEXT DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'maintenance')),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trips table
CREATE TABLE IF NOT EXISTS trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
  bus_id UUID REFERENCES buses(id) ON DELETE CASCADE,
  scheduled_start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  scheduled_end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_start_time TIMESTAMP WITH TIME ZONE,
  actual_end_time TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trip logs table for tracking events
CREATE TABLE IF NOT EXISTS trip_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waypoints_route_id ON waypoints(route_id);
CREATE INDEX IF NOT EXISTS idx_waypoints_location ON waypoints(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_drivers_user_id ON drivers(user_id);
CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);
CREATE INDEX IF NOT EXISTS idx_buses_route_id ON buses(route_id);
CREATE INDEX IF NOT EXISTS idx_buses_driver_id ON buses(driver_id);
CREATE INDEX IF NOT EXISTS idx_buses_location ON buses(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_buses_status ON buses(status);
CREATE INDEX IF NOT EXISTS idx_trips_route_id ON trips(route_id);
CREATE INDEX IF NOT EXISTS idx_trips_bus_id ON trips(bus_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_scheduled_start ON trips(scheduled_start_time);
CREATE INDEX IF NOT EXISTS idx_trip_logs_trip_id ON trip_logs(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_logs_event_type ON trip_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_trip_logs_created_at ON trip_logs(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE waypoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
-- Routes: Allow authenticated users to read all active routes
CREATE POLICY "Allow authenticated users to read active routes" ON routes
  FOR SELECT TO authenticated
  USING (is_active = true);

-- Waypoints: Allow authenticated users to read all waypoints
CREATE POLICY "Allow authenticated users to read waypoints" ON waypoints
  FOR SELECT TO authenticated
  USING (true);

-- Drivers: Allow users to read and update their own driver record
CREATE POLICY "Allow users to read own driver record" ON drivers
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to update own driver record" ON drivers
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert own driver record" ON drivers
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Buses: Allow authenticated users to read active buses
CREATE POLICY "Allow authenticated users to read active buses" ON buses
  FOR SELECT TO authenticated
  USING (status = 'active');

-- Allow drivers to update their own bus
CREATE POLICY "Allow drivers to update own bus" ON buses
  FOR UPDATE TO authenticated
  USING (driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid()));

-- Trips: Allow authenticated users to read trips
CREATE POLICY "Allow authenticated users to read trips" ON trips
  FOR SELECT TO authenticated
  USING (true);

-- Allow drivers to read their own trips
CREATE POLICY "Allow drivers to read own trips" ON trips
  FOR SELECT TO authenticated
  USING (bus_id IN (SELECT id FROM buses WHERE driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())));

-- Trip logs: Allow authenticated users to read and insert trip logs
CREATE POLICY "Allow authenticated users to read trip logs" ON trip_logs
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert trip logs" ON trip_logs
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_routes_updated_at ON routes;
CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON routes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_waypoints_updated_at ON waypoints;
CREATE TRIGGER update_waypoints_updated_at BEFORE UPDATE ON waypoints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_drivers_updated_at ON drivers;
CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_buses_updated_at ON buses;
CREATE TRIGGER update_buses_updated_at BEFORE UPDATE ON buses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_trips_updated_at ON trips;
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for driver documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('driver-documents', 'driver-documents', false)
ON CONFLICT DO NOTHING;

-- Create storage policy for driver documents
CREATE POLICY "Allow drivers to upload own documents" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'driver-documents' AND 
              (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Allow drivers to read own documents" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'driver-documents' AND 
         (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Allow drivers to update own documents" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'driver-documents' AND 
         (storage.foldername(name))[1] = auth.uid()::text);
