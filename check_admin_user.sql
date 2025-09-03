-- Script para verificar e corrigir permissões do usuário anunciai@anunciai

-- 1. Verificar se o usuário existe
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'anunciai@anunciai';

-- 2. Verificar se o usuário tem perfil
SELECT id, email, first_name, last_name, is_vip, created_at
FROM public.profiles 
WHERE email = 'anunciai@anunciai';

-- 3. Verificar roles do usuário
SELECT ur.user_id, ur.role, u.email
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE u.email = 'anunciai@anunciai';

-- 4. Verificar se o usuário pode ver outros perfis (teste de admin)
SELECT COUNT(*) as total_profiles
FROM public.profiles;

-- 5. Verificar se o usuário pode ver serviços
SELECT COUNT(*) as total_services
FROM public.services;

-- 6. Verificar se o usuário pode ver subscribers
SELECT COUNT(*) as total_subscribers
FROM public.subscribers;

-- 7. Se o usuário não tem role de admin, adicionar
-- (Descomente as linhas abaixo se necessário)
/*
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users 
WHERE email = 'anunciai@anunciai'
AND NOT EXISTS (
  SELECT 1 FROM public.user_roles ur 
  WHERE ur.user_id = auth.users.id 
  AND ur.role = 'admin'
);
*/

-- 8. Verificar políticas RLS ativas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'user_roles', 'services', 'subscribers')
ORDER BY tablename, policyname;
