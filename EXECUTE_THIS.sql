-- EXECUTE ESTE SCRIPT NO SUPABASE SQL EDITOR

-- 1. Adicionar colunas faltantes na tabela services_public
ALTER TABLE public.services_public ADD COLUMN IF NOT EXISTS number text;
ALTER TABLE public.services_public ADD COLUMN IF NOT EXISTS neighborhood text;
ALTER TABLE public.services_public ADD COLUMN IF NOT EXISTS cep text;
ALTER TABLE public.services_public ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.services_public ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.services_public ADD COLUMN IF NOT EXISTS whatsapp text;

-- 2. Atualizar a função sync_services_to_public
CREATE OR REPLACE FUNCTION public.sync_services_to_public()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    INSERT INTO public.services_public (
      id, title, description, category, type, city, uf,
      latitude, longitude, logo_url, images, denomination,
      created_at, updated_at, status, is_vip,
      instagram, facebook, website, address, user_id,
      number, neighborhood, cep, phone, email, whatsapp
    )
    SELECT 
      NEW.id, NEW.title, NEW.description, NEW.category, NEW.type, 
      NEW.city, NEW.uf, NEW.latitude, NEW.longitude, NEW.logo_url, 
      NEW.images, NEW.denomination, NEW.created_at, NEW.updated_at, 
      NEW.status, COALESCE(p.is_vip, false),
      NEW.instagram, NEW.facebook, NEW.website, NEW.address, NEW.user_id,
      NEW.number, NEW.neighborhood, NEW.cep, NEW.phone, NEW.email, NEW.whatsapp
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
      website = EXCLUDED.website,
      address = EXCLUDED.address,
      user_id = EXCLUDED.user_id,
      number = EXCLUDED.number,
      neighborhood = EXCLUDED.neighborhood,
      cep = EXCLUDED.cep,
      phone = EXCLUDED.phone,
      email = EXCLUDED.email,
      whatsapp = EXCLUDED.whatsapp;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM public.services_public WHERE id = OLD.id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
