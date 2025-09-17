-- Create a public safe view without RLS (since views inherit from underlying tables)
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