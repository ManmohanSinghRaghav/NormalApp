-- SQL functions for Mathura bus system geo-queries
-- These functions support the MathuraDataService real-time queries

-- Function to get buses near a location
CREATE OR REPLACE FUNCTION get_buses_near_location(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_km DOUBLE PRECISION DEFAULT 5.0
)
RETURNS TABLE (
  id UUID,
  bus_number TEXT,
  vehicle_type vehicle_type_enum,
  current_location_lat DOUBLE PRECISION,
  current_location_lng DOUBLE PRECISION,
  distance_km DOUBLE PRECISION,
  driver_name TEXT,
  driver_rating DOUBLE PRECISION,
  route_name TEXT,
  route_code TEXT,
  fuel_efficiency DOUBLE PRECISION,
  active BOOLEAN
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.bus_number,
    b.vehicle_type,
    ST_Y(b.current_location::geometry) as current_location_lat,
    ST_X(b.current_location::geometry) as current_location_lng,
    ST_Distance(
      b.current_location,
      ST_GeogFromText('POINT(' || user_lng || ' ' || user_lat || ')')
    ) / 1000.0 as distance_km,
    d.full_name as driver_name,
    d.rating as driver_rating,
    r.name as route_name,
    r.code as route_code,
    b.fuel_efficiency,
    b.active
  FROM buses b
  LEFT JOIN drivers d ON b.assigned_driver_id = d.id
  LEFT JOIN driver_route_assignments dra ON d.id = dra.driver_id AND dra.active = true
  LEFT JOIN routes r ON dra.route_id = r.id
  WHERE b.active = true
    AND ST_DWithin(
      b.current_location,
      ST_GeogFromText('POINT(' || user_lng || ' ' || user_lat || ')'),
      radius_km * 1000
    )
  ORDER BY distance_km ASC;
END;
$$;

-- Function to get stops near a location with route information
CREATE OR REPLACE FUNCTION get_stops_near_location(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_km DOUBLE PRECISION DEFAULT 2.0
)
RETURNS TABLE (
  stop_name TEXT,
  stop_lat DOUBLE PRECISION,
  stop_lng DOUBLE PRECISION,
  distance_km DOUBLE PRECISION,
  route_name TEXT,
  route_code TEXT,
  arrival_time TEXT,
  departure_time TEXT,
  amenities JSONB
) 
LANGUAGE plpgsql
AS $$
DECLARE
  route_record RECORD;
  waypoint JSONB;
  stop_distance DOUBLE PRECISION;
BEGIN
  -- Iterate through all active routes
  FOR route_record IN 
    SELECT id, name, code, waypoints
    FROM routes 
    WHERE active = true AND waypoints IS NOT NULL
  LOOP
    -- Iterate through waypoints in each route
    FOR waypoint IN 
      SELECT * FROM jsonb_array_elements(route_record.waypoints)
    LOOP
      -- Calculate distance to this waypoint/stop
      stop_distance := ST_Distance(
        ST_GeogFromText('POINT(' || user_lng || ' ' || user_lat || ')'),
        ST_GeogFromText('POINT(' || (waypoint->>'lng')::DOUBLE PRECISION || ' ' || (waypoint->>'lat')::DOUBLE PRECISION || ')')
      ) / 1000.0;
      
      -- Return stops within radius
      IF stop_distance <= radius_km THEN
        stop_name := waypoint->>'name';
        stop_lat := (waypoint->>'lat')::DOUBLE PRECISION;
        stop_lng := (waypoint->>'lng')::DOUBLE PRECISION;
        distance_km := stop_distance;
        route_name := route_record.name;
        route_code := route_record.code;
        arrival_time := waypoint->>'arrival';
        departure_time := waypoint->>'departure';
        amenities := COALESCE(waypoint->'amenities', '{}'::JSONB);
        
        RETURN NEXT;
      END IF;
    END LOOP;
  END LOOP;
  
  RETURN;
END;
$$;

-- Function to get real-time trip status
CREATE OR REPLACE FUNCTION get_live_trips_status()
RETURNS TABLE (
  trip_id UUID,
  driver_name TEXT,
  bus_number TEXT,
  route_name TEXT,
  route_code TEXT,
  status trip_status_enum,
  start_time TIMESTAMP WITH TIME ZONE,
  current_location_lat DOUBLE PRECISION,
  current_location_lng DOUBLE PRECISION,
  passenger_count INTEGER,
  next_stop_name TEXT,
  estimated_arrival TEXT
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id as trip_id,
    d.full_name as driver_name,
    b.bus_number,
    r.name as route_name,
    r.code as route_code,
    t.status,
    t.start_time,
    ST_Y(b.current_location::geometry) as current_location_lat,
    ST_X(b.current_location::geometry) as current_location_lng,
    t.passenger_count,
    -- Get next stop from waypoints (simplified logic)
    CASE 
      WHEN r.waypoints IS NOT NULL AND jsonb_array_length(r.waypoints) > 0 
      THEN (r.waypoints->0->>'name')::TEXT
      ELSE 'Unknown'
    END as next_stop_name,
    -- Estimated arrival (simplified - would need real calculation)
    CASE 
      WHEN r.waypoints IS NOT NULL AND jsonb_array_length(r.waypoints) > 0 
      THEN (r.waypoints->0->>'arrival')::TEXT
      ELSE '00:00'
    END as estimated_arrival
  FROM trips t
  JOIN drivers d ON t.driver_id = d.id
  JOIN buses b ON t.bus_id = b.id
  JOIN routes r ON t.route_id = r.id
  WHERE t.status IN ('in_progress', 'scheduled')
    AND t.start_time >= CURRENT_DATE
    AND t.start_time <= CURRENT_DATE + INTERVAL '1 day'
  ORDER BY t.start_time ASC;
END;
$$;

-- Function to update bus location (for real-time tracking)
CREATE OR REPLACE FUNCTION update_bus_location(
  p_bus_id UUID,
  p_lat DOUBLE PRECISION,
  p_lng DOUBLE PRECISION
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE buses 
  SET 
    current_location = ST_GeogFromText('POINT(' || p_lng || ' ' || p_lat || ')'),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = p_bus_id AND active = true;
  
  RETURN FOUND;
END;
$$;

-- Function to get driver performance metrics
CREATE OR REPLACE FUNCTION get_driver_performance(
  p_driver_id UUID,
  p_days_back INTEGER DEFAULT 30
)
RETURNS TABLE (
  total_trips INTEGER,
  total_distance_km DOUBLE PRECISION,
  average_rating DOUBLE PRECISION,
  on_time_percentage DOUBLE PRECISION,
  fuel_efficiency_avg DOUBLE PRECISION,
  revenue_generated DOUBLE PRECISION
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(t.id)::INTEGER as total_trips,
    COALESCE(SUM(t.distance_km), 0) as total_distance_km,
    d.rating as average_rating,
    -- Calculate on-time percentage (simplified)
    CASE 
      WHEN COUNT(t.id) > 0 
      THEN (COUNT(CASE WHEN t.status = 'completed' THEN 1 END)::DOUBLE PRECISION / COUNT(t.id)::DOUBLE PRECISION) * 100
      ELSE 0
    END as on_time_percentage,
    b.fuel_efficiency as fuel_efficiency_avg,
    COALESCE(SUM(p.amount), 0) as revenue_generated
  FROM drivers d
  LEFT JOIN trips t ON d.id = t.driver_id 
    AND t.start_time >= CURRENT_DATE - INTERVAL '1 day' * p_days_back
  LEFT JOIN buses b ON d.assigned_bus_id = b.id
  LEFT JOIN payments p ON t.id = p.trip_id AND p.status = 'completed'
  WHERE d.id = p_driver_id
  GROUP BY d.id, d.rating, b.fuel_efficiency;
END;
$$;

-- Function to get route analytics
CREATE OR REPLACE FUNCTION get_route_analytics(
  p_route_id UUID DEFAULT NULL,
  p_days_back INTEGER DEFAULT 7
)
RETURNS TABLE (
  route_id UUID,
  route_name TEXT,
  route_code TEXT,
  total_trips INTEGER,
  average_passengers DOUBLE PRECISION,
  total_revenue DOUBLE PRECISION,
  average_rating DOUBLE PRECISION,
  peak_hours JSONB
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id as route_id,
    r.name as route_name,
    r.code as route_code,
    COUNT(t.id)::INTEGER as total_trips,
    AVG(t.passenger_count) as average_passengers,
    COALESCE(SUM(p.amount), 0) as total_revenue,
    AVG(d.rating) as average_rating,
    -- Peak hours analysis (simplified)
    jsonb_build_object(
      'morning', '07:00-09:00',
      'evening', '17:00-19:00'
    ) as peak_hours
  FROM routes r
  LEFT JOIN trips t ON r.id = t.route_id 
    AND t.start_time >= CURRENT_DATE - INTERVAL '1 day' * p_days_back
  LEFT JOIN drivers d ON t.driver_id = d.id
  LEFT JOIN payments p ON t.id = p.trip_id AND p.status = 'completed'
  WHERE (p_route_id IS NULL OR r.id = p_route_id)
    AND r.active = true
  GROUP BY r.id, r.name, r.code
  ORDER BY total_trips DESC;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_buses_near_location TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_stops_near_location TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_live_trips_status TO authenticated, anon;
GRANT EXECUTE ON FUNCTION update_bus_location TO authenticated;
GRANT EXECUTE ON FUNCTION get_driver_performance TO authenticated;
GRANT EXECUTE ON FUNCTION get_route_analytics TO authenticated, anon;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_buses_location_gist ON buses USING GIST (current_location);
CREATE INDEX IF NOT EXISTS idx_trips_status_date ON trips (status, start_time);
CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers (status);
CREATE INDEX IF NOT EXISTS idx_routes_active ON routes (active);

COMMIT;
