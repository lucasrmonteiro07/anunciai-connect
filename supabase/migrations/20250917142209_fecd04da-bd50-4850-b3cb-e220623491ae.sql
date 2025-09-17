-- Fix the security definer view issue by recreating without security definer
DROP VIEW IF EXISTS public.services_public_safe;

-- Create a regular view (not security definer) for public access that excludes sensitive information
CREATE VIEW public.services_public_safe AS
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

-- Enable RLS on the new view and grant access
ALTER VIEW public.services_public_safe ENABLE ROW LEVEL SECURITY;

-- Create a policy for the view that allows public access
CREATE POLICY "Public can view safe service info" 
ON public.services_public_safe 
FOR SELECT 
USING (true);

-- Grant public access to the safe view
GRANT SELECT ON public.services_public_safe TO anon;
GRANT SELECT ON public.services_public_safe TO authenticated;