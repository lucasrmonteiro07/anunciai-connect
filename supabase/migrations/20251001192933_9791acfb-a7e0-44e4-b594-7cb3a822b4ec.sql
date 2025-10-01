-- Fix Security Definer View issue
-- Drop and recreate the view with SECURITY INVOKER to enforce RLS of the querying user

DROP VIEW IF EXISTS public.services_public_safe;

CREATE VIEW public.services_public_safe 
WITH (security_invoker = true)
AS
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
  neighborhood,
  cep
FROM public.services_public
WHERE status = 'active';

-- Add comment to document the security model
COMMENT ON VIEW public.services_public_safe IS 'Safe view of active services. Uses SECURITY INVOKER to enforce RLS policies of the querying user.';