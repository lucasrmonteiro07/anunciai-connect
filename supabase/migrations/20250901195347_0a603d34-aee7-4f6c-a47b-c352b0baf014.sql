-- Fix the security definer view issue
-- Recreate the services_public view as SECURITY INVOKER to use the querying user's permissions

-- Drop the existing view
DROP VIEW IF EXISTS public.services_public;

-- Recreate the view as SECURITY INVOKER (default, but being explicit)
CREATE VIEW public.services_public 
WITH (security_invoker = true) AS
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

-- Grant public access to the view (this is safe because the view only shows non-sensitive data)
GRANT SELECT ON public.services_public TO anon;
GRANT SELECT ON public.services_public TO authenticated;

-- Add a comment to document the security change
COMMENT ON VIEW public.services_public IS 'Security Invoker view of services table that excludes sensitive contact information (email, phone, whatsapp, address details, owner_name) to protect business owner privacy. Uses querying user permissions.';