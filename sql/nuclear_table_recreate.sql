-- NUCLEAR OPTION: Drop and recreate drivers table to force schema recognition
-- Only use this if the aggressive reload doesn't work

-- Backup any existing data first
CREATE TABLE drivers_backup AS SELECT * FROM drivers;

-- Drop the current table
DROP TABLE IF EXISTS drivers CASCADE;

-- Recreate with exact same structure
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    email TEXT,
    status TEXT DEFAULT 'pending',
    license_number TEXT,
    vehicle_number TEXT,
    vehicle_type TEXT,
    address TEXT,
    notes TEXT,
    rating NUMERIC DEFAULT 0,
    total_trips INTEGER DEFAULT 0,
    total_distance_km NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_drivers_user_id ON drivers(user_id);
CREATE INDEX idx_drivers_status ON drivers(status);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_drivers_updated_at 
    BEFORE UPDATE ON drivers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Disable RLS for testing
ALTER TABLE drivers DISABLE ROW LEVEL SECURITY;

-- Force schema reload
NOTIFY pgrst, 'reload schema';

-- Restore any backed up data
INSERT INTO drivers SELECT * FROM drivers_backup;

-- Clean up backup
DROP TABLE drivers_backup;

-- Verify everything works
SELECT 'Table recreated successfully' as status;
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'drivers' AND table_schema = 'public'
ORDER BY ordinal_position;
