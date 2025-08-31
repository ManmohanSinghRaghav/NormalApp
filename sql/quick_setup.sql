-- Quick setup to enable real-time data in NextStop app
-- Run these commands in Supabase SQL Editor

-- 1. Disable Row Level Security for testing
ALTER TABLE public.routes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.waypoints DISABLE ROW LEVEL SECURITY;  
ALTER TABLE public.buses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips DISABLE ROW LEVEL SECURITY;

-- 2. Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('routes', 'waypoints', 'buses', 'drivers');

-- 3. Quick test - insert a few sample routes if none exist
INSERT INTO public.routes (name, description, is_active) VALUES 
('Krishna Janmabhoomi Circuit', 'Sacred temples tour route', true),
('Vrindavan Express', 'Direct route to Vrindavan', true)
ON CONFLICT DO NOTHING;

-- 4. Insert sample waypoints
INSERT INTO public.waypoints (route_id, name, latitude, longitude, sequence_order) VALUES 
((SELECT id FROM routes WHERE name = 'Krishna Janmabhoomi Circuit' LIMIT 1), 'Krishna Janmabhoomi', 27.5036, 77.6737, 1),
((SELECT id FROM routes WHERE name = 'Krishna Janmabhoomi Circuit' LIMIT 1), 'Dwarkadhish Temple', 27.5098, 77.6743, 2),
((SELECT id FROM routes WHERE name = 'Vrindavan Express' LIMIT 1), 'Mathura Junction', 27.4850, 77.6690, 1),
((SELECT id FROM routes WHERE name = 'Vrindavan Express' LIMIT 1), 'ISKCON Vrindavan', 27.5906, 77.7064, 2)
ON CONFLICT DO NOTHING;

-- 5. Insert sample buses
INSERT INTO public.buses (route_id, vehicle_number, status, latitude, longitude, driver_name, vehicle_type) VALUES 
((SELECT id FROM routes WHERE name = 'Krishna Janmabhoomi Circuit' LIMIT 1), 'MH-20-B-1001', 'active', 27.5036, 77.6737, 'Rajesh Kumar', 'Standard Bus'),
((SELECT id FROM routes WHERE name = 'Vrindavan Express' LIMIT 1), 'MH-20-B-1002', 'active', 27.4850, 77.6690, 'Amit Singh', 'AC Bus')
ON CONFLICT (vehicle_number) DO NOTHING;

-- 6. Verify data
SELECT 'Routes' as table_name, count(*) as record_count FROM routes
UNION ALL
SELECT 'Waypoints', count(*) FROM waypoints  
UNION ALL
SELECT 'Buses', count(*) FROM buses;

-- If you see counts > 0, the app should now show real data instead of "offline data"!
