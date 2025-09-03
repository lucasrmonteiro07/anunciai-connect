-- Script para testar permissões do usuário anunciai@anunciai

-- 1. Testar a função has_role
SELECT 
  u.email,
  u.id as user_id,
  public.has_role(u.id, 'admin'::app_role) as is_admin,
  public.has_role(u.id, 'user'::app_role) as is_user
FROM auth.users u
WHERE u.email = 'anunciai@anunciai';

-- 2. Verificar se as políticas RLS estão funcionando
-- (Execute como o usuário anunciai@anunciai logado)

-- Teste de SELECT em profiles
SELECT COUNT(*) as profiles_count FROM public.profiles;

-- Teste de SELECT em services  
SELECT COUNT(*) as services_count FROM public.services;

-- Teste de SELECT em subscribers
SELECT COUNT(*) as subscribers_count FROM public.subscribers;

-- 3. Verificar se o usuário tem permissão para ver dados de outros usuários
SELECT 
  p.id,
  p.email,
  p.first_name,
  p.last_name,
  p.is_vip,
  p.created_at
FROM public.profiles p
LIMIT 5;

-- 4. Verificar se o usuário pode ver serviços de outros usuários
SELECT 
  s.id,
  s.title,
  s.category,
  s.city,
  s.uf,
  s.status,
  s.created_at
FROM public.services s
LIMIT 5;

-- 5. Verificar se o usuário pode ver subscribers
SELECT 
  sub.id,
  sub.email,
  sub.subscribed,
  sub.subscription_tier,
  sub.subscription_end
FROM public.subscribers sub
LIMIT 5;

-- 6. Verificar se há dados na tabela services_public
SELECT COUNT(*) as public_services_count FROM public.services_public;
