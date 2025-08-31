-- Fix driver table and policies for NextStop app
-- Run this in your Supabase SQL Editor

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow users to insert own driver record" ON drivers;
DROP POLICY IF EXISTS "Allow authenticated users to insert driver records" ON drivers;

-- Ensure drivers table has correct columns
ALTER TABLE drivers 
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Make sure user_id is unique
CREATE UNIQUE INDEX IF NOT EXISTS idx_drivers_user_id_unique ON drivers(user_id);

-- Updated policy to allow users to insert their own driver record
CREATE POLICY "Allow users to insert own driver record" ON drivers
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to read their own driver record  
DROP POLICY IF EXISTS "Allow users to read own driver record" ON drivers;
CREATE POLICY "Allow users to read own driver record" ON drivers
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Policy to allow users to update their own driver record
DROP POLICY IF EXISTS "Allow users to update own driver record" ON drivers;
CREATE POLICY "Allow users to update own driver record" ON drivers
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Ensure phone_number column exists with correct name
ALTER TABLE drivers 
  DROP COLUMN IF EXISTS phone CASCADE;
ALTER TABLE drivers 
  ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Remove email column if it exists (since it's in auth.users)
ALTER TABLE drivers 
  DROP COLUMN IF EXISTS email CASCADE;

-- Make sure all essential columns exist
ALTER TABLE drivers 
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS license_number TEXT,
  ADD COLUMN IF NOT EXISTS vehicle_number TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'review', 'approved', 'rejected', 'suspended'));

-- Add NOT NULL constraint to essential fields
UPDATE drivers SET full_name = 'Unknown' WHERE full_name IS NULL;
ALTER TABLE drivers ALTER COLUMN full_name SET NOT NULL;

UPDATE drivers SET phone_number = '' WHERE phone_number IS NULL;
ALTER TABLE drivers ALTER COLUMN phone_number SET NOT NULL;
