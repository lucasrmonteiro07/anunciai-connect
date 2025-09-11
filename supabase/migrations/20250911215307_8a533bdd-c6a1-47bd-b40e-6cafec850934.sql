-- Add product categories and update services table to support products
-- First, let's add a 'product_type' field to distinguish between services and products
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS product_type text DEFAULT 'service';

-- Add product-specific fields
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS price DECIMAL(10,2);
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS condition text; -- 'new', 'used', 'refurbished'
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS brand text;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS model text;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS warranty_months integer;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS delivery_available boolean DEFAULT false;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS stock_quantity integer;

-- Add the same fields to services_public table
ALTER TABLE public.services_public ADD COLUMN IF NOT EXISTS product_type text DEFAULT 'service';
ALTER TABLE public.services_public ADD COLUMN IF NOT EXISTS price DECIMAL(10,2);
ALTER TABLE public.services_public ADD COLUMN IF NOT EXISTS condition text;
ALTER TABLE public.services_public ADD COLUMN IF NOT EXISTS brand text;
ALTER TABLE public.services_public ADD COLUMN IF NOT EXISTS model text;
ALTER TABLE public.services_public ADD COLUMN IF NOT EXISTS warranty_months integer;
ALTER TABLE public.services_public ADD COLUMN IF NOT EXISTS delivery_available boolean DEFAULT false;
ALTER TABLE public.services_public ADD COLUMN IF NOT EXISTS stock_quantity integer;

-- Update the sync trigger to include new fields
CREATE OR REPLACE FUNCTION public.sync_services_to_public()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    INSERT INTO public.services_public (
      id, title, description, category, type, city, uf,
      latitude, longitude, logo_url, images, denomination,
      created_at, updated_at, status, is_vip,
      instagram, facebook, website, address, user_id,
      number, neighborhood, cep, phone, email, whatsapp,
      valor, product_type, price, condition, brand, model,
      warranty_months, delivery_available, stock_quantity
    )
    SELECT 
      NEW.id, NEW.title, NEW.description, NEW.category, NEW.type, 
      NEW.city, NEW.uf, NEW.latitude, NEW.longitude, NEW.logo_url, 
      NEW.images, NEW.denomination, NEW.created_at, NEW.updated_at, 
      NEW.status, COALESCE(p.is_vip, false),
      NEW.instagram, NEW.facebook, NEW.website, NEW.address, NEW.user_id,
      NEW.number, NEW.neighborhood, NEW.cep, NEW.phone, NEW.email, NEW.whatsapp,
      NEW.valor, NEW.product_type, NEW.price, NEW.condition, NEW.brand, NEW.model,
      NEW.warranty_months, NEW.delivery_available, NEW.stock_quantity
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
      whatsapp = EXCLUDED.whatsapp,
      valor = EXCLUDED.valor,
      product_type = EXCLUDED.product_type,
      price = EXCLUDED.price,
      condition = EXCLUDED.condition,
      brand = EXCLUDED.brand,
      model = EXCLUDED.model,
      warranty_months = EXCLUDED.warranty_months,
      delivery_available = EXCLUDED.delivery_available,
      stock_quantity = EXCLUDED.stock_quantity;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM public.services_public WHERE id = OLD.id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;