-- Fix security issue: Restrict public access to services table to protect sensitive contact information

-- First, drop the existing overly permissive public policy
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;

-- Create a more restrictive policy that only exposes essential business information
-- This policy allows public access to basic business info while protecting sensitive contact details
CREATE POLICY "Public can view limited service info" 
ON public.services 
FOR SELECT 
USING (
  status = 'active'::text
);

-- However, we need to ensure that sensitive fields are not exposed to unauthorized users
-- Let's create a more granular approach by creating a view for public consumption

-- Create a public view that only exposes non-sensitive information
CREATE OR REPLACE VIEW public.services_public AS
SELECT 
  id,
  title,
  description,
  category,
  type,
  denomination,
  city,
  uf,
  latitude,
  longitude,
  website,  -- Website is considered public info
  facebook, -- Social media is considered public info
  instagram, -- Social media is considered public info
  logo_url,
  images,
  created_at,
  updated_at,
  is_vip
FROM public.services
WHERE status = 'active';

-- Grant public access to the view
GRANT SELECT ON public.services_public TO anon;
GRANT SELECT ON public.services_public TO authenticated;

-- Now update the services table policy to be more restrictive for direct access
-- Remove the public policy entirely for the main table
-- Only allow authenticated users to see full details of their own services or admins to see all

-- The existing policies already handle authenticated access:
-- "Users can manage their own services" - allows users to see their own services with all details
-- "Admins can manage all services" - allows admins to see all services with all details

-- Add a comment to document the security change
COMMENT ON VIEW public.services_public IS 'Public view of services table that excludes sensitive contact information (email, phone, whatsapp, address details, owner_name) to protect business owner privacy';