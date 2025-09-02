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

-- Drop existing trigger first
DROP TRIGGER IF EXISTS sync_services_to_public_trigger ON public.services;
DROP FUNCTION IF EXISTS public.sync_services_to_public();

-- Drop the existing services_public table if it exists  
DROP TABLE IF EXISTS public.services_public CASCADE;

-- Create a new services_public table for public data only (excludes sensitive contact info)
CREATE TABLE public.services_public (
  id uuid NOT NULL,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  type text NOT NULL,
  city text NOT NULL,
  uf text NOT NULL,
  latitude numeric,
  longitude numeric,
  logo_url text,
  images text[],
  denomination text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  status text DEFAULT 'active',
  is_vip boolean DEFAULT false,
  instagram text,
  facebook text,
  website text,
  PRIMARY KEY (id)
);

-- Enable RLS on the public table
ALTER TABLE public.services_public ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for the public table to allow everyone to view active services
CREATE POLICY "Anyone can view active services" 
ON public.services_public 
FOR SELECT 
USING (status = 'active');

-- Create a trigger function to sync public data from services to services_public
CREATE OR REPLACE FUNCTION public.sync_services_to_public()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Get VIP status from profiles
    INSERT INTO public.services_public (
      id, title, description, category, type, city, uf,
      latitude, longitude, logo_url, images, denomination,
      created_at, updated_at, status, is_vip,
      instagram, facebook, website
    )
    SELECT 
      NEW.id, NEW.title, NEW.description, NEW.category, NEW.type, 
      NEW.city, NEW.uf, NEW.latitude, NEW.longitude, NEW.logo_url, 
      NEW.images, NEW.denomination, NEW.created_at, NEW.updated_at, 
      NEW.status, COALESCE(p.is_vip, false),
      NEW.instagram, NEW.facebook, NEW.website
    FROM public.profiles p 
    WHERE p.id = NEW.user_id
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      category = EXCLUDED.category,
      type = EXCLUDED.type,
      city = EXCLUDED.city,
      uf = EXCLUDED.uf,
      latitude = EXCLUDED.latitude,
      longitude = EXCLUDED.longitude,
      logo_url = EXCLUDED.logo_url,
      images = EXCLUDED.images,
      denomination = EXCLUDED.denomination,
      updated_at = EXCLUDED.updated_at,
      status = EXCLUDED.status,
      is_vip = EXCLUDED.is_vip,
      instagram = EXCLUDED.instagram,
      facebook = EXCLUDED.facebook,
      website = EXCLUDED.website;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM public.services_public WHERE id = OLD.id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to sync data
CREATE TRIGGER sync_services_to_public_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_services_to_public();

-- Create a secure function for getting contact information
-- Only authenticated users can access contact details for legitimate purposes
CREATE OR REPLACE FUNCTION public.get_service_contact_info(service_id uuid)
RETURNS TABLE(
  phone text,
  email text,
  whatsapp text,
  owner_name text
) AS $$
BEGIN
  -- Only return contact info if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to access contact information';
  END IF;

  RETURN QUERY
  SELECT 
    s.phone,
    s.email,
    s.whatsapp,
    s.owner_name
  FROM public.services s
  WHERE s.id = service_id
    AND s.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Populate the services_public table with existing data
INSERT INTO public.services_public (
  id, title, description, category, type, city, uf,
  latitude, longitude, logo_url, images, denomination,
  created_at, updated_at, status, is_vip,
  instagram, facebook, website
)
SELECT 
  s.id, s.title, s.description, s.category, s.type, 
  s.city, s.uf, s.latitude, s.longitude, s.logo_url, 
  s.images, s.denomination, s.created_at, s.updated_at, 
  s.status, COALESCE(p.is_vip, false),
  s.instagram, s.facebook, s.website
FROM public.services s
LEFT JOIN public.profiles p ON p.id = s.user_id
WHERE s.status = 'active'
ON CONFLICT (id) DO NOTHING;