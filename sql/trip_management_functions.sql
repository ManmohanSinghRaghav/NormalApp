-- Trip Management RPC Functions
-- Run this in your Supabase SQL Editor

-- Function to start a trip
CREATE OR REPLACE FUNCTION start_trip(trip_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  trip_record trips%ROWTYPE;
  bus_record buses%ROWTYPE;
  result JSON;
BEGIN
  -- Get the trip record
  SELECT * INTO trip_record FROM trips WHERE id = trip_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Trip not found');
  END IF;
  
  -- Check if trip is in scheduled status
  IF trip_record.status != 'scheduled' THEN
    RETURN json_build_object('success', false, 'error', 'Trip is not in scheduled status');
  END IF;
  
  -- Get the bus record
  SELECT * INTO bus_record FROM buses WHERE id = trip_record.bus_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Bus not found');
  END IF;
  
  -- Start the trip
  UPDATE trips 
  SET 
    status = 'active',
    actual_start_time = NOW(),
    updated_at = NOW()
  WHERE id = trip_id;
  
  -- Update bus status
  UPDATE buses 
  SET 
    status = 'active',
    last_updated = NOW(),
    updated_at = NOW()
  WHERE id = trip_record.bus_id;
  
  -- Log the trip start
  INSERT INTO trip_logs (trip_id, event_type, event_data, created_at)
  VALUES (trip_id, 'trip_started', json_build_object('started_at', NOW()), NOW());
  
  RETURN json_build_object('success', true, 'message', 'Trip started successfully');
END;
$$;

-- Function to end a trip
CREATE OR REPLACE FUNCTION end_trip(trip_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  trip_record trips%ROWTYPE;
  bus_record buses%ROWTYPE;
  result JSON;
BEGIN
  -- Get the trip record
  SELECT * INTO trip_record FROM trips WHERE id = trip_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Trip not found');
  END IF;
  
  -- Check if trip is in active status
  IF trip_record.status != 'active' THEN
    RETURN json_build_object('success', false, 'error', 'Trip is not active');
  END IF;
  
  -- Get the bus record
  SELECT * INTO bus_record FROM buses WHERE id = trip_record.bus_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Bus not found');
  END IF;
  
  -- End the trip
  UPDATE trips 
  SET 
    status = 'completed',
    actual_end_time = NOW(),
    updated_at = NOW()
  WHERE id = trip_id;
  
  -- Update bus status back to inactive
  UPDATE buses 
  SET 
    status = 'inactive',
    last_updated = NOW(),
    updated_at = NOW()
  WHERE id = trip_record.bus_id;
  
  -- Log the trip end
  INSERT INTO trip_logs (trip_id, event_type, event_data, created_at)
  VALUES (trip_id, 'trip_completed', json_build_object('completed_at', NOW()), NOW());
  
  RETURN json_build_object('success', true, 'message', 'Trip completed successfully');
END;
$$;

-- Function to update bus location during trip
CREATE OR REPLACE FUNCTION update_bus_location(
  bus_id UUID,
  new_latitude FLOAT,
  new_longitude FLOAT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  bus_record buses%ROWTYPE;
  active_trip trips%ROWTYPE;
BEGIN
  -- Get the bus record
  SELECT * INTO bus_record FROM buses WHERE id = bus_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Bus not found');
  END IF;
  
  -- Update bus location
  UPDATE buses 
  SET 
    latitude = new_latitude,
    longitude = new_longitude,
    last_updated = NOW(),
    updated_at = NOW()
  WHERE id = bus_id;
  
  -- Check if there's an active trip for this bus
  SELECT * INTO active_trip 
  FROM trips 
  WHERE bus_id = bus_id AND status = 'active'
  LIMIT 1;
  
  -- If there's an active trip, log the location update
  IF FOUND THEN
    INSERT INTO trip_logs (trip_id, event_type, event_data, created_at)
    VALUES (
      active_trip.id, 
      'location_update', 
      json_build_object(
        'latitude', new_latitude,
        'longitude', new_longitude,
        'timestamp', NOW()
      ), 
      NOW()
    );
  END IF;
  
  RETURN json_build_object('success', true, 'message', 'Location updated successfully');
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION start_trip(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION end_trip(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_bus_location(UUID, FLOAT, FLOAT) TO authenticated;

-- Create trip_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS trip_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for trip logs
CREATE INDEX IF NOT EXISTS idx_trip_logs_trip_id ON trip_logs(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_logs_event_type ON trip_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_trip_logs_created_at ON trip_logs(created_at);

-- Enable RLS on trip_logs
ALTER TABLE trip_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for trip logs
CREATE POLICY "Allow authenticated users to read trip logs" ON trip_logs
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert trip logs" ON trip_logs
  FOR INSERT TO authenticated
  WITH CHECK (true);
