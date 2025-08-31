-- Force PostgREST schema cache reload
-- This tells Supabase to refresh its understanding of the table structure

-- Send reload signal to PostgREST
NOTIFY pgrst, 'reload schema';

-- Alternative method - update the schema version
UPDATE pg_settings 
SET setting = (setting::int + 1)::text 
WHERE name = 'pgrst.db_schemas';

-- Verify the drivers table structure is correct
SELECT 'FORCING SCHEMA CACHE RELOAD...' as action;

-- Check current table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'drivers' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'Schema cache reload initiated. Wait 30 seconds then test signup.' as result;
