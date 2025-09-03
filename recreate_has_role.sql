-- Script para recriar a função has_role com versão mais robusta

-- 1. Remover a função existente
DROP FUNCTION IF EXISTS public.has_role(UUID, app_role);

-- 2. Recriar a função has_role com versão mais robusta
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verificar se o usuário existe
  IF _user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Verificar se o role existe
  IF _role IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Verificar se o usuário tem o role
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
END;
$$;

-- 3. Testar a função recriada
SELECT 
  'Teste função has_role recriada' as teste,
  public.has_role('6010ee81-d449-4609-b7e6-689e97ffe487'::uuid, 'admin'::app_role) as resultado;

-- 4. Verificar se o usuário tem permissão para executar a função
SELECT 
  'Teste permissão função' as teste,
  has_function_privilege('6010ee81-d449-4609-b7e6-689e97ffe487'::uuid, 'public.has_role(UUID, app_role)', 'EXECUTE') as pode_executar;

-- 5. Verificar se há algum problema com o enum app_role
SELECT 
  'Verificação enum app_role' as teste,
  enumlabel
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'app_role');

-- 6. Verificar se o usuário tem role de admin
SELECT 
  'Verificação role admin' as teste,
  ur.user_id,
  ur.role,
  u.email
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE u.email = 'anunciai@anunciai.app.br'
AND ur.role = 'admin';
