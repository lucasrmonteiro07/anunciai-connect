-- Fix security issues: Add search_path to functions
CREATE OR REPLACE FUNCTION public.check_service_duplicate()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check for existing service with same title, user, and city
  IF EXISTS (
    SELECT 1 FROM public.services 
    WHERE title = NEW.title 
      AND user_id = NEW.user_id 
      AND city = NEW.city 
      AND uf = NEW.uf
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)
  ) THEN
    RAISE EXCEPTION 'Já existe um anúncio com este título nesta localização para este usuário';
  END IF;
  
  RETURN NEW;
END;
$$;