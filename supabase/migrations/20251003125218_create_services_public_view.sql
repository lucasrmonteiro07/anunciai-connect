/*
  # Create Public View for Services

  1. Views
    - `services_public_safe`: Public-safe view of active services with limited fields
  
  2. Security
    - Grant SELECT to anon and authenticated users
    - No RLS needed on views (inherits from base table)
*/

-- Create public-safe view for services
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
  is_vip,
  denomination,
  instagram,
  facebook,
  website,
  product_type,
  valor,
  price,
  condition,
  brand,
  model,
  warranty_months,
  delivery_available,
  stock_quantity,
  user_id,
  created_at
FROM public.services
WHERE status = 'active';

-- Grant SELECT permission on the view
GRANT SELECT ON public.services_public_safe TO anon, authenticated;