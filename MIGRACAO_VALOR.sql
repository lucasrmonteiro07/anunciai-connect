-- =====================================================
-- MIGRAÇÃO: Adicionar campo VALOR às tabelas
-- Data: 03/01/2025
-- Descrição: Adiciona campo valor para preços dos serviços
-- =====================================================

-- 1. Adicionar campo valor à tabela services
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS valor text;

-- 2. Adicionar campo valor à tabela services_public
ALTER TABLE public.services_public ADD COLUMN IF NOT EXISTS valor text;

-- 3. Atualizar função de sincronização para incluir o campo valor
CREATE OR REPLACE FUNCTION public.sync_services_to_public()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Get VIP status from profiles
    INSERT INTO public.services_public (
      id, title, description, category, type, city, uf,
      latitude, longitude, logo_url, images, denomination,
      created_at, updated_at, status, is_vip,
      instagram, facebook, website, address, user_id, valor
    )
    SELECT 
      NEW.id, NEW.title, NEW.description, NEW.category, NEW.type, 
      NEW.city, NEW.uf, NEW.latitude, NEW.longitude, NEW.logo_url, 
      NEW.images, NEW.denomination, NEW.created_at, NEW.updated_at, 
      NEW.status, COALESCE(p.is_vip, false),
      NEW.instagram, NEW.facebook, NEW.website, NEW.address, NEW.user_id, NEW.valor
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
      created_at = EXCLUDED.created_at,
      updated_at = EXCLUDED.updated_at,
      status = EXCLUDED.status,
      is_vip = EXCLUDED.is_vip,
      instagram = EXCLUDED.instagram,
      facebook = EXCLUDED.facebook,
      website = EXCLUDED.website,
      address = EXCLUDED.address,
      user_id = EXCLUDED.user_id,
      valor = EXCLUDED.valor;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM public.services_public WHERE id = OLD.id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Atualizar registros existentes com dados de valor (se houver)
UPDATE public.services_public 
SET valor = s.valor
FROM public.services s
WHERE public.services_public.id = s.id 
AND s.valor IS NOT NULL;

-- 5. Verificar se a migração foi aplicada corretamente
SELECT 
  'services' as tabela,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'services' 
AND column_name = 'valor'

UNION ALL

SELECT 
  'services_public' as tabela,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'services_public' 
AND column_name = 'valor';

-- =====================================================
-- INSTRUÇÕES PARA APLICAR:
-- 1. Acesse o Supabase Dashboard: https://supabase.com/dashboard
-- 2. Vá para o projeto: wkchztcfbwnbukpqejix
-- 3. Abra o SQL Editor
-- 4. Cole e execute este script completo
-- 5. Verifique se a consulta final retorna as colunas valor
-- =====================================================
