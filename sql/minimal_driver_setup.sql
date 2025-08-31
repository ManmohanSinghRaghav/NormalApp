-- Minimal driver setup for immediate testing
-- Run this in Supabase SQL Editor

-- Create drivers table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.drivers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'review', 'approved', 'rejected', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable RLS for testing (enable later with proper policies)
ALTER TABLE public.drivers DISABLE ROW LEVEL SECURITY;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_drivers_user_id ON public.drivers(user_id);

-- Test if table is accessible
SELECT count(*) as driver_count FROM public.drivers;
