-- Database schema for NextStop app
-- Run this in your Supabase SQL Editor

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

-- Buses table
CREATE TABLE IF NOT EXISTS buses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id UUID REFERENCES routes(id) ON DELETE SET NULL,
  vehicle_number TEXT UNIQUE NOT NULL,
  driver_name TEXT,
  status TEXT DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'maintenance')),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waypoints_route_id ON waypoints(route_id);
CREATE INDEX IF NOT EXISTS idx_waypoints_location ON waypoints(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_buses_route_id ON buses(route_id);
CREATE INDEX IF NOT EXISTS idx_buses_location ON buses(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_buses_status ON buses(status);

-- Enable Row Level Security (RLS)
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE waypoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
-- (You may want to adjust these based on your security requirements)

-- Routes: Allow authenticated users to read all active routes
CREATE POLICY "Allow authenticated users to read active routes" ON routes
  FOR SELECT TO authenticated
  USING (is_active = true);

-- Waypoints: Allow authenticated users to read all waypoints
CREATE POLICY "Allow authenticated users to read waypoints" ON waypoints
  FOR SELECT TO authenticated
  USING (true);

-- Buses: Allow authenticated users to read active buses
CREATE POLICY "Allow authenticated users to read active buses" ON buses
  FOR SELECT TO authenticated
  USING (status = 'active');

-- Allow drivers to update their bus location (you'll need to add driver authentication)
-- For now, we'll allow authenticated users to update buses
CREATE POLICY "Allow authenticated users to update buses" ON buses
  FOR UPDATE TO authenticated
  USING (true);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON routes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_waypoints_updated_at BEFORE UPDATE ON waypoints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buses_updated_at BEFORE UPDATE ON buses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
