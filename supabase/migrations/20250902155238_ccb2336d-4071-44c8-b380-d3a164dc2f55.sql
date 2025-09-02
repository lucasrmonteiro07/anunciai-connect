-- Fix security vulnerability in subscribers table RLS policy
-- Remove email-based access to prevent unauthorized access to payment data

-- Drop the existing policy that allows email-based access
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.subscribers;

-- Create a new secure policy that only allows access based on user_id
CREATE POLICY "Users can view their own subscription" ON public.subscribers
  FOR SELECT
  USING (user_id = auth.uid());