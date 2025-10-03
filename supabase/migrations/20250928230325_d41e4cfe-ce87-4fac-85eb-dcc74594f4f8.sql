-- Create function to remove duplicate services
CREATE OR REPLACE FUNCTION public.remove_duplicate_services()
RETURNS TABLE(removed_count INT, details JSONB)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  duplicate_record RECORD;
  total_removed INT := 0;
  removal_details JSONB := '[]'::JSONB;
BEGIN
  -- Find and remove duplicates, keeping only the oldest record for each group
  FOR duplicate_record IN
    SELECT 
      title, user_id, city, uf,
      array_agg(id ORDER BY created_at) as ids,
      COUNT(*) as duplicate_count
    FROM public.services 
    GROUP BY title, user_id, city, uf 
    HAVING COUNT(*) > 1
  LOOP
    -- Keep the first (oldest) record, remove the rest
    DELETE FROM public.services 
    WHERE id = ANY(duplicate_record.ids[2:]);
    
    -- Track what was removed
    total_removed := total_removed + (duplicate_record.duplicate_count - 1);
    removal_details := removal_details || jsonb_build_object(
      'title', duplicate_record.title,
      'user_id', duplicate_record.user_id,
      'city', duplicate_record.city,
      'removed_count', duplicate_record.duplicate_count - 1,
      'kept_id', duplicate_record.ids[1]
    );
  END LOOP;
  
  -- Log the cleanup action
  IF total_removed > 0 THEN
    PERFORM public.log_admin_action(
      'duplicate_cleanup',
      'services',
      NULL,
      jsonb_build_object(
        'total_removed', total_removed,
        'cleanup_details', removal_details,
        'cleanup_date', NOW()
      )
    );
  END IF;
  
  RETURN QUERY SELECT total_removed, removal_details;
END;
$$;

-- Create function to prevent future duplicates
CREATE OR REPLACE FUNCTION public.check_service_duplicate()
RETURNS TRIGGER
LANGUAGE plpgsql
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

-- Create trigger to prevent duplicates
CREATE TRIGGER prevent_service_duplicates
  BEFORE INSERT OR UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.check_service_duplicate();