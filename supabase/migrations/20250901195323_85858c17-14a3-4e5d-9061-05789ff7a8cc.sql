-- Fix the remaining security issue: Remove public access to sensitive fields in services table
-- The current "Public can view limited service info" policy still exposes ALL fields to the public
-- We need to remove public access entirely to the main services table since we have the services_public view

-- Drop the current public policy that still exposes sensitive data
DROP POLICY IF EXISTS "Public can view limited service info" ON public.services;

-- Ensure only authenticated users can access the main services table
-- The existing policies already handle this:
-- "Users can manage their own services" - for service owners
-- "Admins can manage all services" - for administrators

-- The public should only use the services_public view which excludes sensitive fields
-- No additional policy needed for public access to the main table

-- Add a comment to clarify the security model
COMMENT ON TABLE public.services IS 'Contains sensitive business contact information. Public access restricted to services_public view only.';