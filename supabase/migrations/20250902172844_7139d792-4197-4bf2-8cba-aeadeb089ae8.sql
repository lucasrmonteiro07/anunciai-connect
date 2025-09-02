-- Fix security issue: Restrict access to sensitive contact information in services table
-- Create proper RLS policies for services table to protect contact data

-- First, let's update the existing RLS policies to be more restrictive
DROP POLICY IF EXISTS "Admins can manage all services" ON public.services;
DROP POLICY IF EXISTS "Users can manage their own services" ON public.services;

-- Create restrictive policies for the main services table
CREATE POLICY "Admins can manage all services" 
ON public.services 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can manage their own services" 
ON public.services 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create a secure public view that excludes sensitive contact information
DROP VIEW IF EXISTS public.services_public;

CREATE VIEW public.services_public AS
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
  status
FROM public.services
WHERE status = 'active';

-- Grant SELECT access to the public view for all authenticated users
GRANT SELECT ON public.services_public TO authenticated;

-- Create RLS policy for the public view to allow everyone to view active services
ALTER TABLE public.services_public ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services" 
ON public.services_public 
FOR SELECT 
USING (true);

-- Create a secure function for getting contact information
-- Only service owners and interested users can access contact details
CREATE OR REPLACE FUNCTION public.get_service_contact_info(service_id uuid)
RETURNS TABLE(
  phone text,
  email text,
  whatsapp text,
  owner_name text,
  instagram text,
  facebook text,
  website text
) AS $$
BEGIN
  -- Only return contact info if user is the service owner or is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to access contact information';
  END IF;

  RETURN QUERY
  SELECT 
    s.phone,
    s.email,
    s.whatsapp,
    s.owner_name,
    s.instagram,
    s.facebook,
    s.website
  FROM public.services s
  WHERE s.id = service_id
    AND s.status = 'active'
    AND (
      s.user_id = auth.uid() OR -- Service owner
      has_role(auth.uid(), 'admin'::app_role) -- Admin
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;