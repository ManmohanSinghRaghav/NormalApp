-- Sample data for testing driver features
-- Run this in your Supabase SQL Editor after creating the complete schema

-- Insert sample routes (if not already exists)
INSERT INTO routes (id, name, description, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Route 1: Mathura Central to Railway Station', 'Main route connecting city center to railway station', true),
('550e8400-e29b-41d4-a716-446655440002', 'Route 2: Krishna Janmabhoomi to Dwarkadheesh Temple', 'Religious route covering major temples', true),
('550e8400-e29b-41d4-a716-446655440003', 'Route 3: Mathura University to Bus Stand', 'Student route from university to main bus terminal', true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample waypoints (bus stops) for Mathura area
INSERT INTO waypoints (id, route_id, name, latitude, longitude, sequence_order) VALUES
-- Route 1 waypoints
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Mathura Central', 27.4924, 77.6737, 1),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Government Hospital', 27.4950, 77.6750, 2),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Mathura Junction Railway Station', 27.4991, 77.6713, 3),

-- Route 2 waypoints
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Krishna Janmabhoomi Complex', 27.5142, 77.6739, 1),
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'Holi Gate', 27.5098, 77.6712, 2),
('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'Dwarkadheesh Temple', 27.5037, 77.6731, 3),

-- Route 3 waypoints
('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 'Mathura University', 27.4734, 77.6945, 1),
('660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', 'Krishna Nagar', 27.5134, 77.6834, 2),
('660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003', 'Mathura Bus Stand', 27.4898, 77.6737, 3)
ON CONFLICT (id) DO NOTHING;

-- Note: Drivers will be created when users sign up through the app
-- But here's an example of what the data would look like:

-- Sample approved driver (you'll need to create this after a user signs up)
/*
INSERT INTO drivers (id, user_id, full_name, phone_number, license_number, license_expiry_date, 
                    vehicle_number, vehicle_type, vehicle_model, vehicle_year, address, 
                    emergency_contact_name, emergency_contact_phone, experience, status, approved_at) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'USER_UUID_HERE', 'Ram Kumar Singh', '+91-9876543210', 
 'UP80DL123456789', '2025-12-31', 'UP80-1234', 'bus', 'Tata 407', 2020, 
 'Village Maholi, Mathura, UP', 'Shyam Singh', '+91-9876543211', '5', 'approved', NOW());
*/

-- Sample buses (these would be assigned to approved drivers)
INSERT INTO buses (id, route_id, vehicle_number, vehicle_type, driver_name, status, latitude, longitude) VALUES
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'UP80-1234', 'bus', 'Ram Kumar Singh', 'inactive', 27.4924, 77.6737),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'UP80-5678', 'bus', 'Shyam Lal', 'inactive', 27.5142, 77.6739),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'UP80-9012', 'mini_bus', 'Hari Prasad', 'inactive', 27.4734, 77.6945)
ON CONFLICT (id) DO NOTHING;

-- Sample scheduled trips for today and tomorrow
INSERT INTO trips (id, route_id, bus_id, scheduled_start_time, scheduled_end_time, status) VALUES
-- Today's trips
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 
 CURRENT_DATE + INTERVAL '6 hours', CURRENT_DATE + INTERVAL '7 hours', 'scheduled'),
('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 
 CURRENT_DATE + INTERVAL '8 hours', CURRENT_DATE + INTERVAL '9 hours', 'scheduled'),
('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 
 CURRENT_DATE + INTERVAL '10 hours', CURRENT_DATE + INTERVAL '11 hours', 'scheduled'),
 
('990e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 
 CURRENT_DATE + INTERVAL '7 hours', CURRENT_DATE + INTERVAL '8 hours', 'scheduled'),
('990e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 
 CURRENT_DATE + INTERVAL '9 hours', CURRENT_DATE + INTERVAL '10 hours', 'scheduled'),

('990e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', 
 CURRENT_DATE + INTERVAL '8 hours', CURRENT_DATE + INTERVAL '9 hours', 'scheduled'),

-- Tomorrow's trips
('990e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 
 CURRENT_DATE + INTERVAL '1 day 6 hours', CURRENT_DATE + INTERVAL '1 day 7 hours', 'scheduled'),
('990e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 
 CURRENT_DATE + INTERVAL '1 day 7 hours', CURRENT_DATE + INTERVAL '1 day 8 hours', 'scheduled')
ON CONFLICT (id) DO NOTHING;

-- Helper function to link drivers to buses after driver registration
-- This would typically be done by an admin interface, but here's a sample update
/*
-- After a driver is approved, link them to a bus:
UPDATE buses 
SET driver_id = (SELECT id FROM drivers WHERE user_id = 'USER_UUID_HERE')
WHERE vehicle_number = 'UP80-1234';
*/

-- Update bus locations randomly for testing (simulate movement)
-- You can run this periodically to see buses move on the map
/*
UPDATE buses SET 
  latitude = latitude + (random() - 0.5) * 0.002,
  longitude = longitude + (random() - 0.5) * 0.002,
  last_updated = NOW()
WHERE status = 'active';
*/
