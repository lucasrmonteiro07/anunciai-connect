-- Security Fix: Ensure views don't have SECURITY DEFINER
-- Recreate the services_public_safe view to explicitly avoid SECURITY DEFINER

-- Drop and recreate the view to ensure it doesn't have any security definer properties
DROP VIEW IF EXISTS public.services_public_safe;

-- Create a clean view without any SECURITY DEFINER properties
-- This view provides safe public access to service data without sensitive contact information
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
    neighborhood,
    cep
FROM services_public
WHERE status = 'active';

-- Grant proper permissions to the view
GRANT SELECT ON public.services_public_safe TO anon;
GRANT SELECT ON public.services_public_safe TO authenticated;

-- Add comment to document the security consideration
COMMENT ON VIEW public.services_public_safe IS 'Safe public view that excludes sensitive contact information like phone, email, whatsapp, and full address details. Created without SECURITY DEFINER for proper security.';