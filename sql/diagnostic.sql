-- DIAGNOSTIC: Check current database state
-- Run this to see what tables and columns actually exist

-- 1. List all tables in public schema
SELECT 'TABLES IN PUBLIC SCHEMA:' as section;
SELECT table_name, table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Check if drivers table exists and its structure
SELECT 'DRIVERS TABLE STRUCTURE:' as section;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'drivers' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check RLS status
SELECT 'ROW LEVEL SECURITY STATUS:' as section;
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    forcerowsecurity as rls_forced
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'drivers';

-- 4. Check table permissions
SELECT 'TABLE PERMISSIONS:' as section;
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges
WHERE table_schema = 'public' 
  AND table_name = 'drivers'
ORDER BY grantee, privilege_type;

-- 5. Check if we can count rows (basic access test)
SELECT 'ACCESS TEST:' as section;
SELECT 'Counting drivers table...' as test;
SELECT count(*) as row_count FROM public.drivers;

SELECT 'DIAGNOSTIC COMPLETE' as status;
