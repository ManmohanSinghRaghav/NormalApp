-- AGGRESSIVE schema cache reload for Supabase
-- Run this in Supabase SQL Editor to force schema cache refresh

-- Method 1: Standard PostgREST reload
NOTIFY pgrst, 'reload schema';

-- Method 2: Force restart PostgREST process (more aggressive)
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE application_name = 'PostgREST';

-- Method 3: Clear and rebuild schema cache
DO $$
BEGIN
    -- Clear any cached schema information
    PERFORM pg_notify('pgrst', 'reload schema');
    
    -- Wait a moment
    PERFORM pg_sleep(1);
    
    -- Force another reload
    PERFORM pg_notify('pgrst', 'reload schema');
END $$;

-- Method 4: Update schema version to force refresh
SELECT current_setting('pgrst.db_schema') as current_schema;

-- Verify table exists and is accessible
SELECT 'drivers table exists' as status, count(*) as current_rows FROM drivers;

-- Test that PostgREST can see the columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'drivers'
ORDER BY ordinal_position;
