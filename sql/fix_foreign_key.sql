-- Fix foreign key constraint issue
-- This makes the foreign key constraint more forgiving for async user creation

-- Drop the existing foreign key constraint
ALTER TABLE public.drivers DROP CONSTRAINT IF EXISTS drivers_user_id_fkey;

-- Recreate it as deferrable (allows temporary violations within transaction)
ALTER TABLE public.drivers 
ADD CONSTRAINT drivers_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE 
DEFERRABLE INITIALLY DEFERRED;

-- Alternative: Remove the foreign key entirely for testing
-- ALTER TABLE public.drivers DROP CONSTRAINT IF EXISTS drivers_user_id_fkey;

-- Check the constraint was updated
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name,
    tc.is_deferrable,
    tc.initially_deferred
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'drivers'
  AND tc.table_schema = 'public';

SELECT 'Foreign key constraint updated to be deferrable' as result;
