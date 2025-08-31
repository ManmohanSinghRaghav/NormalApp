-- Simple test to see what columns are expected by the drivers table
-- This will show us the exact error when we try to insert minimal data

-- First, let's see the table structure
\d drivers;

-- Try a minimal insert to see what fails
INSERT INTO drivers (user_id, full_name, status) 
VALUES ('test-uuid', 'Test Name', 'pending');

-- If that fails, try with different column names
INSERT INTO drivers (user_id, name, status) 
VALUES ('test-uuid-2', 'Test Name 2', 'pending');
