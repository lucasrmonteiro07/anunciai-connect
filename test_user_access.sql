-- Script para testar acesso às tabelas como usuário logado

-- IMPORTANTE: Execute este script como o usuário anunciai@anunciai.app.br logado

-- 1. Verificar se a função has_role está funcionando com auth.uid()
SELECT 
  'Teste has_role com auth.uid()' as teste,
  public.has_role(auth.uid(), 'admin'::app_role) as is_admin,
  public.has_role(auth.uid(), 'user'::app_role) as is_user;

-- 2. Verificar auth.uid()
SELECT 
  'Verificação auth.uid()' as teste,
  auth.uid() as current_user_id;

-- 3. Testar acesso às tabelas
SELECT 'Teste profiles' as teste, COUNT(*) as total_profiles FROM public.profiles;

SELECT 'Teste services' as teste, COUNT(*) as total_services FROM public.services;

SELECT 'Teste subscribers' as teste, COUNT(*) as total_subscribers FROM public.subscribers;

-- 4. Ver alguns dados de exemplo
SELECT 'Dados profiles' as teste, id, email, first_name, last_name, is_vip 
FROM public.profiles 
LIMIT 3;

SELECT 'Dados services' as teste, id, title, category, city, uf, status 
FROM public.services 
LIMIT 3;

-- 5. Testar acesso à tabela user_roles
SELECT 'Teste user_roles' as teste, COUNT(*) as total_user_roles FROM public.user_roles;

-- 6. Verificar se o usuário atual tem role de admin
SELECT 'Verificação role admin atual' as teste, role 
FROM public.user_roles 
WHERE user_id = auth.uid();
