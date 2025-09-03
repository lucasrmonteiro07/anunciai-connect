-- Script para testar as políticas RLS diretamente

-- 1. Verificar se RLS está habilitado
SELECT 
  'RLS habilitado' as teste,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'user_roles', 'services', 'subscribers')
ORDER BY tablename;

-- 2. Verificar políticas RLS ativas
SELECT 
  'Políticas RLS ativas' as teste,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'user_roles', 'services', 'subscribers')
ORDER BY tablename, policyname;

-- 3. Verificar se há dados nas tabelas (como superuser)
SELECT 
  'Verificação de dados (superuser)' as teste,
  (SELECT COUNT(*) FROM public.profiles) as profiles_count,
  (SELECT COUNT(*) FROM public.services) as services_count,
  (SELECT COUNT(*) FROM public.subscribers) as subscribers_count;

-- 4. Verificar se há dados na tabela services_public
SELECT 
  'Verificação services_public' as teste,
  (SELECT COUNT(*) FROM public.services_public) as services_public_count;

-- 5. Verificar se há dados na tabela user_roles
SELECT 
  'Verificação user_roles' as teste,
  (SELECT COUNT(*) FROM public.user_roles) as user_roles_count;

-- 6. Verificar se há dados na tabela auth.users
SELECT 
  'Verificação auth.users' as teste,
  (SELECT COUNT(*) FROM auth.users) as auth_users_count;

-- 7. Verificar se há dados na tabela auth.users com email específico
SELECT 
  'Verificação auth.users específico' as teste,
  (SELECT COUNT(*) FROM auth.users WHERE email = 'anunciai@anunciai.app.br') as specific_user_count;

-- 8. Verificar se há dados na tabela public.profiles com email específico
SELECT 
  'Verificação public.profiles específico' as teste,
  (SELECT COUNT(*) FROM public.profiles WHERE email = 'anunciai@anunciai.app.br') as specific_profile_count;

-- 9. Verificar se há dados na tabela public.user_roles com user_id específico
SELECT 
  'Verificação public.user_roles específico' as teste,
  (SELECT COUNT(*) FROM public.user_roles WHERE user_id = '6010ee81-d449-4609-b7e6-689e97ffe487') as specific_role_count;
