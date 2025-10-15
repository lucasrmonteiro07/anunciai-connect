-- Criar função para sincronizar status VIP quando o profile é atualizado
CREATE OR REPLACE FUNCTION public.sync_vip_to_services()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Quando o is_vip do profile mudar, atualizar todos os services do usuário
  IF OLD.is_vip IS DISTINCT FROM NEW.is_vip THEN
    -- Atualizar tabela services
    UPDATE public.services
    SET is_vip = NEW.is_vip,
        updated_at = NOW()
    WHERE user_id = NEW.id;
    
    -- Atualizar tabela services_public
    UPDATE public.services_public
    SET is_vip = NEW.is_vip,
        updated_at = NOW()
    WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger na tabela profiles
DROP TRIGGER IF EXISTS trigger_sync_vip_to_services ON public.profiles;
CREATE TRIGGER trigger_sync_vip_to_services
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_vip_to_services();