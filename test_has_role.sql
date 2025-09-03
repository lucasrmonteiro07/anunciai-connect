-- Script para testar especificamente a função has_role

-- 1. Testar a função has_role diretamente
SELECT 
  'Teste função has_role' as teste,
  public.has_role('6010ee81-d449-4609-b7e6-689e97ffe487'::uuid, 'admin'::app_role) as resultado;

-- 2. Verificar se há dados nas tabelas
SELECT 
  'Verificação de dados' as teste,
  (SELECT COUNT(*) FROM public.profiles) as profiles_count,
  (SELECT COUNT(*) FROM public.services) as services_count,
  (SELECT COUNT(*) FROM public.subscribers) as subscribers_count;

-- 3. Verificar se a função has_role está funcionando com auth.uid()
-- (Execute como o usuário logado)
SELECT 
  'Teste has_role com auth.uid()' as teste,
  public.has_role(auth.uid(), 'admin'::app_role) as is_admin,
  public.has_role(auth.uid(), 'user'::app_role) as is_user;

-- 4. Testar acesso às tabelas (execute como o usuário logado)
SELECT 'Teste profiles' as teste, COUNT(*) as total_profiles FROM public.profiles;

SELECT 'Teste services' as teste, COUNT(*) as total_services FROM public.services;

SELECT 'Teste subscribers' as teste, COUNT(*) as total_subscribers FROM public.subscribers;

-- 5. Ver alguns dados de exemplo
SELECT 'Dados profiles' as teste, id, email, first_name, last_name, is_vip 
FROM public.profiles 
LIMIT 3;

SELECT 'Dados services' as teste, id, title, category, city, uf, status 
FROM public.services 
LIMIT 3;
