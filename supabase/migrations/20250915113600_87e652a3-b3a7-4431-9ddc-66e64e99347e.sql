-- Fix security issue: Restrict access to sensitive contact information in services_public table

-- Drop all existing policies on services_public
DROP POLICY IF EXISTS "Public can view basic service info" ON public.services_public;
DROP POLICY IF EXISTS "Authenticated users can view full service info" ON public.services_public;
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services_public;

-- Create a more restrictive policy that protects sensitive contact information
-- Only authenticated users can access the full services_public table
CREATE POLICY "Authenticated users can view services" 
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

-- Grant public access to the safe view
GRANT SELECT ON public.services_public_safe TO anon;
GRANT SELECT ON public.services_public_safe TO authenticated;