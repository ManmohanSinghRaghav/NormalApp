-- Sample data for testing the NextStop app
-- Run this in your Supabase SQL Editor after creating the tables

-- Insert sample routes
INSERT INTO routes (id, name, description, is_active) VALUES
(gen_random_uuid(), 'Route 1: Mathura Central to Railway Station', 'Main route connecting city center to railway station', true),
(gen_random_uuid(), 'Route 2: Krishna Janmabhoomi to Dwarkadheesh Temple', 'Religious route covering major temples', true),
(gen_random_uuid(), 'Route 3: Mathura University to Bus Stand', 'Student route from university to main bus terminal', true)
ON CONFLICT DO NOTHING;

-- Insert sample waypoints (bus stops) for Mathura area
-- These coordinates are around Mathura, Uttar Pradesh
WITH route_ids AS (
  SELECT id, name FROM routes LIMIT 3
),
sample_waypoints AS (
  SELECT * FROM (VALUES
    ('Mathura Junction Railway Station', 27.4991, 77.6713),
    ('Krishna Janmabhoomi Complex', 27.5142, 77.6739),
    ('Dwarkadheesh Temple', 27.5037, 77.6731),
    ('Mathura Bus Stand', 27.4898, 77.6737),
    ('Government Medical College', 27.4856, 77.6789),
    ('Mathura University', 27.4734, 77.6945),
    ('Holi Gate', 27.5098, 77.6712),
    ('Dampier Nagar', 27.4789, 77.6823),
    ('New Bus Stand', 27.4923, 77.6845),
    ('Krishna Nagar', 27.5134, 77.6834),
    ('Raman Reti', 27.5245, 77.6712),
    ('Masani Devi Temple', 27.4967, 77.6634)
  ) AS w(name, lat, lng)
)
INSERT INTO waypoints (id, route_id, name, latitude, longitude, sequence_order)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM route_ids ORDER BY random() LIMIT 1),
  sw.name,
  sw.lat,
  sw.lng,
  row_number() OVER (PARTITION BY (SELECT id FROM route_ids ORDER BY random() LIMIT 1) ORDER BY random())
FROM sample_waypoints sw
ON CONFLICT DO NOTHING;

-- Insert sample buses
WITH route_ids AS (
  SELECT id FROM routes LIMIT 3
)
INSERT INTO buses (id, route_id, vehicle_number, driver_name, status, latitude, longitude, last_updated) VALUES
(gen_random_uuid(), (SELECT id FROM route_ids OFFSET 0 LIMIT 1), 'UP80-1234', 'Ram Kumar', 'active', 27.4991, 77.6713, NOW()),
(gen_random_uuid(), (SELECT id FROM route_ids OFFSET 1 LIMIT 1), 'UP80-5678', 'Shyam Singh', 'active', 27.5142, 77.6739, NOW()),
(gen_random_uuid(), (SELECT id FROM route_ids OFFSET 2 LIMIT 1), 'UP80-9012', 'Hari Prasad', 'active', 27.4898, 77.6737, NOW())
ON CONFLICT DO NOTHING;

-- Update bus locations periodically (you can run this manually to simulate movement)
-- This is just for testing - in production, buses would update their own locations
/*
UPDATE buses SET 
  latitude = latitude + (random() - 0.5) * 0.001,
  longitude = longitude + (random() - 0.5) * 0.001,
  last_updated = NOW()
WHERE status = 'active';
*/
