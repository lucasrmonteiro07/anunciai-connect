-- Script final de debug para identificar o problema

-- 1. Verificar se o usuário tem role de admin
SELECT 
  '1. Verificação role admin' as teste,
  ur.user_id,
  ur.role,
  u.email
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE u.email = 'anunciai@anunciai.app.br'
AND ur.role = 'admin';

-- 2. Testar a função has_role
SELECT 
  '2. Teste função has_role' as teste,
  public.has_role('6010ee81-d449-4609-b7e6-689e97ffe487'::uuid, 'admin'::app_role) as resultado;

-- 3. Verificar se há dados nas tabelas (como superuser)
SELECT 
  '3. Verificação de dados (superuser)' as teste,
  (SELECT COUNT(*) FROM public.profiles) as profiles_count,
  (SELECT COUNT(*) FROM public.services) as services_count,
  (SELECT COUNT(*) FROM public.subscribers) as subscribers_count;

-- 4. Verificar políticas RLS ativas
SELECT 
  '4. Políticas RLS ativas' as teste,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'user_roles', 'services', 'subscribers')
ORDER BY tablename, policyname;

-- 5. Verificar se RLS está habilitado
SELECT 
  '5. RLS habilitado' as teste,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'user_roles', 'services', 'subscribers')
ORDER BY tablename;

-- 6. Testar acesso como o usuário específico (execute como o usuário logado)
-- Descomente as linhas abaixo para testar:

/*
-- Teste de SELECT em profiles
SELECT '6a. Teste profiles' as teste, COUNT(*) as total_profiles FROM public.profiles;

-- Teste de SELECT em services  
SELECT '6b. Teste services' as teste, COUNT(*) as total_services FROM public.services;

-- Teste de SELECT em subscribers
SELECT '6c. Teste subscribers' as teste, COUNT(*) as total_subscribers FROM public.subscribers;

-- Ver alguns dados de exemplo
SELECT '6d. Dados profiles' as teste, id, email, first_name, last_name, is_vip 
FROM public.profiles 
LIMIT 3;

SELECT '6e. Dados services' as teste, id, title, category, city, uf, status 
FROM public.services 
LIMIT 3;

-- Testar função has_role com auth.uid()
SELECT '6f. Teste has_role com auth.uid()' as teste,
  public.has_role(auth.uid(), 'admin'::app_role) as is_admin,
  public.has_role(auth.uid(), 'user'::app_role) as is_user;
*/
