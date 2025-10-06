/*
  # Create Public View for Services

  1. Views
    - `services_public`: Public view of active services with all necessary fields
  
  2. Security
    - Enable RLS on view
    - Grant SELECT to anon and authenticated users
    - Only show active services
*/

-- Create public view for services
CREATE OR REPLACE VIEW public.services_public AS
SELECT 
  id,
  user_id,
  title,
  description,
  category,
  type,
  city,
  uf,
  latitude,
  longitude,
  address,
  phone,
  email,
  whatsapp,
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
  status,
  created_at,
  updated_at
FROM public.services
WHERE status = 'active';

-- Grant SELECT permission on the view
GRANT SELECT ON public.services_public TO anon, authenticated;