-- Script para criar função RPC simples para atualizar services

-- 1. Remover função existente se houver
DROP FUNCTION IF EXISTS public.update_service(uuid, jsonb, uuid);

-- 2. Criar função simples para atualizar service
CREATE OR REPLACE FUNCTION public.update_service(
  service_id uuid,
  service_data jsonb,
  user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Verificar se o usuário é o dono do serviço
  IF NOT EXISTS (
    SELECT 1 FROM public.services 
    WHERE id = service_id AND user_id = update_service.user_id
  ) THEN
    RAISE EXCEPTION 'Usuário não tem permissão para editar este serviço';
  END IF;

  -- Atualizar diretamente na tabela services
  UPDATE public.services SET
    title = COALESCE((service_data->>'title')::text, title),
    description = COALESCE((service_data->>'description')::text, description),
    category = COALESCE((service_data->>'category')::text, category),
    type = COALESCE((service_data->>'type')::text, type),
    denomination = COALESCE((service_data->>'denomination')::text, denomination),
    address = COALESCE((service_data->>'address')::text, address),
    number = COALESCE((service_data->>'number')::text, number),
    neighborhood = COALESCE((service_data->>'neighborhood')::text, neighborhood),
    cep = COALESCE((service_data->>'cep')::text, cep),
    city = COALESCE((service_data->>'city')::text, city),
    uf = COALESCE((service_data->>'uf')::text, uf),
    phone = COALESCE((service_data->>'phone')::text, phone),
    email = COALESCE((service_data->>'email')::text, email),
    whatsapp = COALESCE((service_data->>'whatsapp')::text, whatsapp),
    instagram = COALESCE((service_data->>'instagram')::text, instagram),
    facebook = COALESCE((service_data->>'facebook')::text, facebook),
    website = COALESCE((service_data->>'website')::text, website),
    images = COALESCE((service_data->'images')::text[], images),
    latitude = COALESCE((service_data->>'latitude')::numeric, latitude),
    longitude = COALESCE((service_data->>'longitude')::numeric, longitude),
    updated_at = COALESCE((service_data->>'updated_at')::timestamptz, updated_at)
  WHERE id = service_id AND user_id = update_service.user_id;

  -- Verificar se alguma linha foi atualizada
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Serviço não encontrado ou usuário sem permissão';
  END IF;

  -- Retornar sucesso
  RETURN jsonb_build_object('success', true, 'message', 'Serviço atualizado com sucesso');
END;
$$;

-- 3. Testar a função
SELECT 'Função update_service criada com sucesso' as resultado;
