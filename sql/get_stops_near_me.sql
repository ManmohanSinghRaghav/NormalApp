-- Create the "Stops Near Me" RPC Function
-- Run this in your Supabase SQL Editor

-- First, enable the PostGIS extension if not already enabled
-- This provides geographic functions for distance calculations
CREATE EXTENSION IF NOT EXISTS postgis;

-- Function to get stops near a user's location
CREATE OR REPLACE FUNCTION get_stops_near_me(
  user_lat FLOAT,
  user_lng FLOAT,
  radius_km FLOAT DEFAULT 5.0
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  latitude FLOAT,
  longitude FLOAT,
  route_id UUID,
  route_name TEXT,
  distance FLOAT
)
LANGUAGE SQL
AS $$
  SELECT 
    w.id,
    w.name,
    w.latitude,
    w.longitude,
    r.id as route_id,
    r.name as route_name,
    ST_Distance(
      ST_MakePoint(user_lng, user_lat)::geography,
      ST_MakePoint(w.longitude, w.latitude)::geography
    ) / 1000.0 as distance
  FROM waypoints w
  LEFT JOIN routes r ON w.route_id = r.id
  WHERE ST_DWithin(
    ST_MakePoint(user_lng, user_lat)::geography,
    ST_MakePoint(w.longitude, w.latitude)::geography,
    radius_km * 1000
  )
  ORDER BY distance
  LIMIT 50;
$$;

-- Alternative function if PostGIS is not available (less accurate but simpler)
-- This uses the haversine formula for distance calculation
CREATE OR REPLACE FUNCTION get_stops_near_me_simple(
  user_lat FLOAT,
  user_lng FLOAT,
  radius_km FLOAT DEFAULT 5.0
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  latitude FLOAT,
  longitude FLOAT,
  route_id UUID,
  route_name TEXT,
  distance FLOAT
)
LANGUAGE SQL
AS $$
  SELECT 
    w.id,
    w.name,
    w.latitude,
    w.longitude,
    r.id as route_id,
    r.name as route_name,
    (
      6371 * acos(
        cos(radians(user_lat)) * 
        cos(radians(w.latitude)) * 
        cos(radians(w.longitude) - radians(user_lng)) + 
        sin(radians(user_lat)) * 
        sin(radians(w.latitude))
      )
    ) as distance
  FROM waypoints w
  LEFT JOIN routes r ON w.route_id = r.id
  WHERE (
    6371 * acos(
      cos(radians(user_lat)) * 
      cos(radians(w.latitude)) * 
      cos(radians(w.longitude) - radians(user_lng)) + 
      sin(radians(user_lat)) * 
      sin(radians(w.latitude))
    )
  ) <= radius_km
  ORDER BY distance
  LIMIT 50;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_stops_near_me(FLOAT, FLOAT, FLOAT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_stops_near_me_simple(FLOAT, FLOAT, FLOAT) TO authenticated;

-- Example usage:
-- SELECT * FROM get_stops_near_me(27.4924, 77.6737, 5.0);
-- This will return stops within 5km of Mathura coordinates
