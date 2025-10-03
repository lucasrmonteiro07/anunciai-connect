-- Security Fix: Restrict access to services_public table to prevent contact information harvesting
-- Remove the overly permissive policy that allows authenticated users to access sensitive contact data

-- Drop the existing permissive policy
DROP POLICY IF EXISTS "Authenticated users can view services" ON public.services_public;

-- Create a restrictive policy that only allows service owners and admins to access their own data
-- This ensures sensitive contact information cannot be harvested by competitors
CREATE POLICY "Owners and admins can view services_public" 
ON public.services_public 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Ensure the safe view has proper access for public consumption
-- (This should already exist from the previous migration, but ensuring it's properly granted)
GRANT SELECT ON public.services_public_safe TO anon;
GRANT SELECT ON public.services_public_safe TO authenticated;

-- Add a comment to document the security consideration
COMMENT ON TABLE public.services_public IS 'Contains sensitive business contact information. Access restricted to owners and admins only. Use services_public_safe view for public consumption.';
COMMENT ON VIEW public.services_public_safe IS 'Safe public view that excludes sensitive contact information like phone, email, whatsapp, and address details.';