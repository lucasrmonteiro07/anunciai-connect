-- Fix security definer view issue by recreating services_public view properly
DROP VIEW IF EXISTS public.services_public;

-- Create the view with SECURITY INVOKER to use the permissions of the querying user
CREATE VIEW public.services_public 
WITH (security_invoker = true)
AS
SELECT 
  s.id,
  s.title,
  s.description,
  s.category,
  s.type,
  s.denomination,
  s.city,
  s.uf,
  s.latitude,
  s.longitude,
  s.logo_url,
  s.images,
  s.instagram,
  s.facebook,
  s.website,
  s.created_at,
  s.updated_at,
  p.is_vip
FROM services s
LEFT JOIN profiles p ON s.user_id = p.id
WHERE s.status = 'active';

-- Grant select permissions to authenticated users and anon users for public access
GRANT SELECT ON public.services_public TO authenticated;
GRANT SELECT ON public.services_public TO anon;