-- Fix the user_id column to be NOT NULL since it's required for RLS policies
-- This ensures data integrity and prevents RLS policy violations

ALTER TABLE public.services 
ALTER COLUMN user_id SET NOT NULL;