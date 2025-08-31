-- Sample buses for Mathura bus tracking system
-- Run this after creating the schema and inserting route data

-- Insert realistic buses for Mathura routes
INSERT INTO public.buses (route_id, vehicle_number, status, latitude, longitude, driver_name, vehicle_type, last_updated) VALUES

-- Krishna Temple Circuit buses
((SELECT id FROM routes WHERE name = 'Krishna Temple Circuit' LIMIT 1), 'MH-20-B-1001', 'active', 27.5036, 77.6737, 'Rajesh Kumar', 'Standard Bus', NOW()),
((SELECT id FROM routes WHERE name = 'Krishna Temple Circuit' LIMIT 1), 'MH-20-B-1002', 'active', 27.5042, 77.6745, 'Amit Sharma', 'AC Bus', NOW()),

-- Ghat Express buses  
((SELECT id FROM routes WHERE name = 'Ghat Express' LIMIT 1), 'MH-20-B-1003', 'active', 27.5067, 77.6789, 'Suresh Yadav', 'Standard Bus', NOW()),
((SELECT id FROM routes WHERE name = 'Ghat Express' LIMIT 1), 'MH-20-B-1004', 'active', 27.5087, 77.6812, 'Vikram Singh', 'Mini Bus', NOW()),

-- University Express buses
((SELECT id FROM routes WHERE name = 'University Express' LIMIT 1), 'MH-20-B-1005', 'active', 27.4898, 77.6698, 'Ravi Gupta', 'Standard Bus', NOW()),
((SELECT id FROM routes WHERE name = 'University Express' LIMIT 1), 'MH-20-B-1006', 'active', 27.4876, 77.6712, 'Manoj Kumar', 'AC Bus', NOW()),

-- Station Link buses
((SELECT id FROM routes WHERE name = 'Station Link' LIMIT 1), 'MH-20-B-1007', 'active', 27.4850, 77.6690, 'Dinesh Yadav', 'Standard Bus', NOW()),
((SELECT id FROM routes WHERE name = 'Station Link' LIMIT 1), 'MH-20-B-1008', 'active', 27.4867, 77.6712, 'Sandeep Jain', 'Mini Bus', NOW()),

-- Medical Circuit buses
((SELECT id FROM routes WHERE name = 'Medical Circuit' LIMIT 1), 'MH-20-B-1009', 'active', 27.4823, 77.6634, 'Praveen Sharma', 'AC Bus', NOW()),
((SELECT id FROM routes WHERE name = 'Medical Circuit' LIMIT 1), 'MH-20-B-1010', 'active', 27.4845, 77.6656, 'Rohit Kumar', 'Standard Bus', NOW()),

-- Vrindavan Route buses (if exists)
((SELECT id FROM routes WHERE name LIKE '%Vrindavan%' LIMIT 1), 'MH-20-B-1011', 'active', 27.5800, 77.7000, 'Krishna Das', 'AC Bus', NOW()),
((SELECT id FROM routes WHERE name LIKE '%Vrindavan%' LIMIT 1), 'MH-20-B-1012', 'active', 27.5850, 77.7050, 'Govind Sharma', 'Standard Bus', NOW());

-- Add some buses in maintenance/inactive status for realism
INSERT INTO public.buses (route_id, vehicle_number, status, latitude, longitude, driver_name, vehicle_type, last_updated) VALUES
(NULL, 'MH-20-B-1013', 'maintenance', NULL, NULL, 'Mukesh Singh', 'Standard Bus', NOW()),
(NULL, 'MH-20-B-1014', 'inactive', NULL, NULL, 'Ajay Kumar', 'Mini Bus', NOW());

-- Create a function to simulate bus movement (optional)
CREATE OR REPLACE FUNCTION simulate_bus_movement()
RETURNS void AS $$
BEGIN
    UPDATE public.buses 
    SET 
        latitude = latitude + (random() - 0.5) * 0.002,  -- Small random movement
        longitude = longitude + (random() - 0.5) * 0.002,
        last_updated = NOW()
    WHERE status = 'active' AND latitude IS NOT NULL AND longitude IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Run this function to simulate live movement (call periodically)
-- SELECT simulate_bus_movement();
