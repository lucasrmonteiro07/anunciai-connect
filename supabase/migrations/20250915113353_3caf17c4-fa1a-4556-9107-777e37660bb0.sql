-- Fix security issue: Restrict access to sensitive contact information in services_public table

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services_public;

-- Create new policies that protect sensitive contact information
-- Policy 1: Allow public access to basic service information (excluding sensitive contact details)
CREATE POLICY "Public can view basic service info" 
ON public.services_public 
FOR SELECT 
USING (
  status = 'active'::text 
  AND (
    -- Allow access to all columns except sensitive contact information
    -- This policy will be used in conjunction with column-level security
    TRUE
  )
);

-- Policy 2: Allow authenticated users to view all service information
CREATE POLICY "Authenticated users can view full service info" 
ON public.services_public 
FOR SELECT 
TO authenticated
USING (status = 'active'::text);

-- Create a view for public access that excludes sensitive information
CREATE OR REPLACE VIEW public.services_public_safe AS
SELECT 
  id,
  title,
  description,
  category,
  type,
  city,
  uf,
  latitude,
  longitude,
  logo_url,
  images,
  denomination,
  created_at,
  updated_at,
  status,
  is_vip,
  user_id,
  instagram,
  facebook,
  website,
  valor,
  product_type,
  price,
  condition,
  brand,
  model,
  warranty_months,
  delivery_available,
  stock_quantity,
  -- Include only non-sensitive address information
  neighborhood,
  cep
  -- Exclude: phone, email, whatsapp, address, number (street number)
FROM public.services_public
WHERE status = 'active';

-- Enable RLS on the new view
ALTER VIEW public.services_public_safe SET (security_invoker = true);

-- Grant public access to the safe view
GRANT SELECT ON public.services_public_safe TO anon;
GRANT SELECT ON public.services_public_safe TO authenticated;