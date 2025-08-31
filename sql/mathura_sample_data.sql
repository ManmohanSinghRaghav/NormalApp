-- Sample data for Mathura bus system
-- This file contains comprehensive bus routes, stops, and schedules for Mathura region

-- Insert Routes for Mathura
INSERT INTO public.routes (name, code, start_location, end_location, priority_score, distance_km, estimated_duration_minutes, waypoints, active) VALUES

-- Religious Circuit Routes
('Krishna Temple Circuit', 'KTC001', 'Krishna Janmabhoomi', 'Dwarkadheesh Temple', 95, 8.5, 25, 
 '[
   {"name": "Krishna Janmabhoomi", "lat": 27.5036, "lng": 77.6737, "arrival": "06:00", "departure": "06:02"},
   {"name": "Keshav Dev Temple", "lat": 27.5042, "lng": 77.6745, "arrival": "06:05", "departure": "06:07"},
   {"name": "Vishram Ghat", "lat": 27.5067, "lng": 77.6789, "arrival": "06:12", "departure": "06:15"},
   {"name": "Rangji Temple", "lat": 27.5089, "lng": 77.6756, "arrival": "06:20", "departure": "06:22"},
   {"name": "Dwarkadheesh Temple", "lat": 27.5098, "lng": 77.6743, "arrival": "06:25", "departure": "06:27"}
 ]'::jsonb, true),

('Ghat Express', 'GE002', 'Vishram Ghat', 'Govind Ghat', 85, 6.2, 20,
 '[
   {"name": "Vishram Ghat", "lat": 27.5067, "lng": 77.6789, "arrival": "07:00", "departure": "07:02"},
   {"name": "Yamuna Bank", "lat": 27.5087, "lng": 77.6812, "arrival": "07:08", "departure": "07:10"},
   {"name": "Kedar Ghat", "lat": 27.5156, "lng": 77.6823, "arrival": "07:15", "departure": "07:17"},
   {"name": "Govind Ghat", "lat": 27.5178, "lng": 77.6834, "arrival": "07:20", "departure": "07:22"}
 ]'::jsonb, true),

-- University and Educational Routes  
('University Express', 'UE003', 'Mathura University', 'Government College', 80, 12.3, 35,
 '[
   {"name": "Mathura University", "lat": 27.4898, "lng": 27.4898, "arrival": "08:00", "departure": "08:02"},
   {"name": "Engineering College", "lat": 27.4876, "lng": 77.6712, "arrival": "08:10", "departure": "08:12"},
   {"name": "City Center", "lat": 27.4924, "lng": 77.6737, "arrival": "08:20", "departure": "08:22"},
   {"name": "Inter College", "lat": 27.4945, "lng": 77.6698, "arrival": "08:28", "departure": "08:30"},
   {"name": "Government College", "lat": 27.4967, "lng": 77.6665, "arrival": "08:35", "departure": "08:37"}
 ]'::jsonb, true),

-- Transportation Hub Routes
('Station Link', 'SL004', 'Mathura Railway Station', 'ISBT Mathura', 90, 15.7, 45,
 '[
   {"name": "Mathura Railway Station", "lat": 27.4850, "lng": 77.6690, "arrival": "09:00", "departure": "09:03"},
   {"name": "Station Road Market", "lat": 27.4867, "lng": 77.6712, "arrival": "09:08", "departure": "09:10"},
   {"name": "Civil Lines", "lat": 27.4889, "lng": 77.6734, "arrival": "09:15", "departure": "09:17"},
   {"name": "Dampier Nagar", "lat": 27.4912, "lng": 77.6756, "arrival": "09:22", "departure": "09:24"},
   {"name": "Bhuteshwar", "lat": 27.4934, "lng": 77.6778, "arrival": "09:30", "departure": "09:32"},
   {"name": "ISBT Mathura", "lat": 27.4956, "lng": 77.6801, "arrival": "09:45", "departure": "09:47"}
 ]'::jsonb, true),

-- Hospital and Medical Routes
('Medical Circuit', 'MC005', 'District Hospital', 'SN Medical College', 75, 9.8, 30,
 '[
   {"name": "District Hospital", "lat": 27.4823, "lng": 77.6634, "arrival": "10:00", "departure": "10:02"},
   {"name": "CHC Mathura", "lat": 27.4845, "lng": 77.6656, "arrival": "10:08", "departure": "10:10"},
   {"name": "Private Hospital Zone", "lat": 27.4867, "lng": 77.6678, "arrival": "10:15", "departure": "10:17"},
   {"name": "Medical Market", "lat": 27.4889, "lng": 77.6701, "arrival": "10:22", "departure": "10:24"},
   {"name": "SN Medical College", "lat": 27.4912, "lng": 77.6723, "arrival": "10:30", "departure": "10:32"}
 ]'::jsonb, true),

-- Market and Commercial Routes
('Bazaar Express', 'BE006', 'Holi Gate', 'New Bus Stand', 70, 11.2, 40,
 '[
   {"name": "Holi Gate", "lat": 27.4998, "lng": 77.6712, "arrival": "11:00", "departure": "11:02"},
   {"name": "Tilak Dwar", "lat": 27.5012, "lng": 77.6734, "arrival": "11:07", "departure": "11:09"},
   {"name": "Sadar Bazaar", "lat": 27.5034, "lng": 77.6756, "arrival": "11:15", "departure": "11:18"},
   {"name": "Chowk Bazaar", "lat": 27.5056, "lng": 77.6778, "arrival": "11:25", "departure": "11:27"},
   {"name": "Mathura Cantonment", "lat": 27.5078, "lng": 77.6801, "arrival": "11:35", "departure": "11:37"},
   {"name": "New Bus Stand", "lat": 27.5098, "lng": 77.6823, "arrival": "11:40", "departure": "11:42"}
 ]'::jsonb, true);

-- Insert sample buses for Mathura routes
INSERT INTO public.buses (bus_number, vehicle_type, active, current_location, fuel_efficiency, notes) VALUES

-- Krishna Temple Circuit buses
('UP-35-KT-1001', 'bus', true, ST_GeogFromText('POINT(77.6737 27.5036)'), 12.5, 'AC Bus for temple circuit'),
('UP-35-KT-1002', 'miniBus', true, ST_GeogFromText('POINT(77.6745 27.5042)'), 15.2, 'Non-AC mini bus'),
('UP-35-KT-1003', 'bus', true, ST_GeogFromText('POINT(77.6789 27.5067)'), 11.8, 'AC Bus with wheelchair access'),

-- Ghat Express buses  
('UP-35-GE-2001', 'miniBus', true, ST_GeogFromText('POINT(77.6789 27.5067)'), 16.0, 'Compact bus for ghat route'),
('UP-35-GE-2002', 'auto', true, ST_GeogFromText('POINT(77.6812 27.5087)'), 22.5, 'Auto rickshaw for narrow ghat roads'),

-- University Express buses
('UP-35-UE-3001', 'bus', true, ST_GeogFromText('POINT(77.6698 27.4898)'), 13.2, 'Student special bus'),
('UP-35-UE-3002', 'bus', true, ST_GeogFromText('POINT(77.6712 27.4876)'), 12.8, 'AC bus for university route'),
('UP-35-UE-3003', 'miniBus', true, ST_GeogFromText('POINT(77.6737 27.4924)'), 14.5, 'Quick shuttle service'),

-- Station Link buses
('UP-35-SL-4001', 'bus', true, ST_GeogFromText('POINT(77.6690 27.4850)'), 11.5, 'Heavy duty station bus'),
('UP-35-SL-4002', 'bus', true, ST_GeogFromText('POINT(77.6712 27.4867)'), 12.0, 'Luggage compartment bus'),

-- Medical Circuit buses
('UP-35-MC-5001', 'miniBus', true, ST_GeogFromText('POINT(77.6634 27.4823)'), 15.8, 'Emergency medical transport'),
('UP-35-MC-5002', 'auto', true, ST_GeogFromText('POINT(77.6656 27.4845)'), 20.0, 'Quick medical access'),

-- Bazaar Express buses
('UP-35-BE-6001', 'bus', true, ST_GeogFromText('POINT(77.6712 27.4998)'), 10.5, 'Heavy capacity market bus'),
('UP-35-BE-6002', 'miniBus', true, ST_GeogFromText('POINT(77.6734 27.5012)'), 14.0, 'Goods transport capable');

-- Insert sample drivers for Mathura
INSERT INTO public.drivers (full_name, phone, email, rating, status, notes, total_distance_km, total_trips) VALUES

('Ram Kumar Sharma', '+91-9876501001', 'ram.sharma@nextstop.com', 4.8, 'approved', 'Experienced temple circuit driver, 15 years experience', 25847.5, 1250),
('Priya Mathur', '+91-9876501002', 'priya.mathur@nextstop.com', 4.9, 'approved', 'Female driver, specializes in ghat routes', 18923.2, 980),
('Suresh Yadav', '+91-9876501003', 'suresh.yadav@nextstop.com', 4.6, 'approved', 'University route specialist, student friendly', 31245.8, 1567),
('Lakshmi Devi', '+91-9876501004', 'lakshmi.devi@nextstop.com', 4.7, 'approved', 'Medical emergency trained driver', 22156.3, 1123),
('Gopal Singh', '+91-9876501005', 'gopal.singh@nextstop.com', 4.5, 'approved', 'Station route expert, heavy vehicle license', 28934.7, 1445),
('Radha Gupta', '+91-9876501006', 'radha.gupta@nextstop.com', 4.8, 'approved', 'Market route specialist, 12 years experience', 19876.4, 1089),
('Mohan Lal', '+91-9876501007', 'mohan.lal@nextstop.com', 4.4, 'pending', 'New driver application, 5 years experience', 0, 0),
('Sunita Verma', '+91-9876501008', 'sunita.verma@nextstop.com', 4.6, 'approved', 'Multi-route certified, weekend specialist', 16754.2, 876);

-- Assign drivers to buses (update the buses table with driver assignments)
UPDATE public.buses SET assigned_driver_id = (SELECT id FROM public.drivers WHERE full_name = 'Ram Kumar Sharma') WHERE bus_number = 'UP-35-KT-1001';
UPDATE public.buses SET assigned_driver_id = (SELECT id FROM public.drivers WHERE full_name = 'Priya Mathur') WHERE bus_number = 'UP-35-KT-1002';
UPDATE public.buses SET assigned_driver_id = (SELECT id FROM public.drivers WHERE full_name = 'Suresh Yadav') WHERE bus_number = 'UP-35-UE-3001';
UPDATE public.buses SET assigned_driver_id = (SELECT id FROM public.drivers WHERE full_name = 'Lakshmi Devi') WHERE bus_number = 'UP-35-MC-5001';
UPDATE public.buses SET assigned_driver_id = (SELECT id FROM public.drivers WHERE full_name = 'Gopal Singh') WHERE bus_number = 'UP-35-SL-4001';
UPDATE public.buses SET assigned_driver_id = (SELECT id FROM public.drivers WHERE full_name = 'Radha Gupta') WHERE bus_number = 'UP-35-BE-6001';

-- Assign drivers to routes (update the drivers table with route assignments)
UPDATE public.drivers SET assigned_route_ids = ARRAY[(SELECT id FROM public.routes WHERE code = 'KTC001')::TEXT] WHERE full_name = 'Ram Kumar Sharma';
UPDATE public.drivers SET assigned_route_ids = ARRAY[(SELECT id FROM public.routes WHERE code = 'GE002')::TEXT] WHERE full_name = 'Priya Mathur';
UPDATE public.drivers SET assigned_route_ids = ARRAY[(SELECT id FROM public.routes WHERE code = 'UE003')::TEXT] WHERE full_name = 'Suresh Yadav';
UPDATE public.drivers SET assigned_route_ids = ARRAY[(SELECT id FROM public.routes WHERE code = 'MC005')::TEXT] WHERE full_name = 'Lakshmi Devi';
UPDATE public.drivers SET assigned_route_ids = ARRAY[(SELECT id FROM public.routes WHERE code = 'SL004')::TEXT] WHERE full_name = 'Gopal Singh';
UPDATE public.drivers SET assigned_route_ids = ARRAY[(SELECT id FROM public.routes WHERE code = 'BE006')::TEXT] WHERE full_name = 'Radha Gupta';

-- Insert sample scheduled trips for the day
INSERT INTO public.trips (driver_id, bus_id, route_id, start_time, status, distance_km, passenger_count, fuel_price_per_litre) VALUES

-- Krishna Temple Circuit trips
((SELECT id FROM public.drivers WHERE full_name = 'Ram Kumar Sharma'), 
 (SELECT id FROM public.buses WHERE bus_number = 'UP-35-KT-1001'),
 (SELECT id FROM public.routes WHERE code = 'KTC001'),
 CURRENT_DATE + INTERVAL '6 hours', 'scheduled', 8.5, 0, 95.50),

((SELECT id FROM public.drivers WHERE full_name = 'Ram Kumar Sharma'), 
 (SELECT id FROM public.buses WHERE bus_number = 'UP-35-KT-1001'),
 (SELECT id FROM public.routes WHERE code = 'KTC001'),
 CURRENT_DATE + INTERVAL '7 hours', 'scheduled', 8.5, 0, 95.50),

-- University Express trips
((SELECT id FROM public.drivers WHERE full_name = 'Suresh Yadav'), 
 (SELECT id FROM public.buses WHERE bus_number = 'UP-35-UE-3001'),
 (SELECT id FROM public.routes WHERE code = 'UE003'),
 CURRENT_DATE + INTERVAL '8 hours', 'scheduled', 12.3, 0, 95.50),

-- Station Link trips
((SELECT id FROM public.drivers WHERE full_name = 'Gopal Singh'), 
 (SELECT id FROM public.buses WHERE bus_number = 'UP-35-SL-4001'),
 (SELECT id FROM public.routes WHERE code = 'SL004'),
 CURRENT_DATE + INTERVAL '9 hours', 'scheduled', 15.7, 0, 95.50);

-- Insert sample admin settings specific to Mathura operations
INSERT INTO public.admin_settings (setting_key, setting_value, description, category) VALUES

('mathura_temple_timings', '{"opening": "04:30", "closing": "21:30", "aarti_times": ["06:00", "12:00", "19:00"]}', 'Temple timings for route planning', 'operations'),
('mathura_festival_calendar', '{"janmashtami": "2025-09-15", "holi": "2025-03-14", "diwali": "2025-11-02"}', 'Major festivals affecting bus schedules', 'events'),
('mathura_peak_hours', '{"morning": ["07:00-09:00"], "evening": ["17:00-19:00"], "temple_rush": ["06:00-08:00", "18:00-20:00"]}', 'Peak traffic hours for Mathura', 'operations'),
('emergency_contacts_mathura', '{"police": "100", "ambulance": "108", "fire": "101", "tourist_helpline": "1363"}', 'Emergency contacts for Mathura region', 'emergency'),
('mathura_weather_alerts', '{"monsoon_season": "July-September", "extreme_heat": "April-June", "fog_season": "December-January"}', 'Weather considerations for operations', 'weather');

-- Insert sample payments for completed trips (previous day)
INSERT INTO public.payments (trip_id, passenger_id, amount, payment_method, status, payment_date, notes) VALUES

((SELECT id FROM public.trips LIMIT 1), 'PASS_001', 15.00, 'cash', 'completed', CURRENT_DATE - INTERVAL '1 day', 'Temple circuit fare'),
((SELECT id FROM public.trips LIMIT 1), 'PASS_002', 12.00, 'digital', 'completed', CURRENT_DATE - INTERVAL '1 day', 'Student discount applied'),
((SELECT id FROM public.trips LIMIT 1), 'PASS_003', 20.00, 'cash', 'completed', CURRENT_DATE - INTERVAL '1 day', 'Station route fare');

-- Create driver-route assignments for better tracking
INSERT INTO public.driver_route_assignments (driver_id, route_id, assigned_at, active, notes) VALUES

((SELECT id FROM public.drivers WHERE full_name = 'Ram Kumar Sharma'),
 (SELECT id FROM public.routes WHERE code = 'KTC001'),
 CURRENT_DATE - INTERVAL '30 days', true, 'Primary driver for temple circuit'),

((SELECT id FROM public.drivers WHERE full_name = 'Priya Mathur'),
 (SELECT id FROM public.routes WHERE code = 'GE002'),
 CURRENT_DATE - INTERVAL '25 days', true, 'Specialized in ghat routes'),

((SELECT id FROM public.drivers WHERE full_name = 'Suresh Yadav'),
 (SELECT id FROM public.routes WHERE code = 'UE003'),
 CURRENT_DATE - INTERVAL '45 days', true, 'University route specialist'),

((SELECT id FROM public.drivers WHERE full_name = 'Lakshmi Devi'),
 (SELECT id FROM public.routes WHERE code = 'MC005'),
 CURRENT_DATE - INTERVAL '20 days', true, 'Medical emergency certified'),

((SELECT id FROM public.drivers WHERE full_name = 'Gopal Singh'),
 (SELECT id FROM public.routes WHERE code = 'SL004'),
 CURRENT_DATE - INTERVAL '35 days', true, 'Heavy vehicle specialist'),

((SELECT id FROM public.drivers WHERE full_name = 'Radha Gupta'),
 (SELECT id FROM public.routes WHERE code = 'BE006'),
 CURRENT_DATE - INTERVAL '40 days', true, 'Market route expert');

-- Update driver assignment statistics
UPDATE public.drivers SET 
  assigned_bus_id = (SELECT id FROM public.buses WHERE assigned_driver_id = public.drivers.id LIMIT 1)
WHERE status = 'approved';

COMMIT;
