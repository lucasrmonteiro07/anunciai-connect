-- Script para corrigir acesso à tabela services

-- 1. Verificar se há políticas RLS na tabela services
SELECT 
  'Políticas RLS na tabela services' as teste,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'services';

-- 2. Verificar se há políticas RLS na tabela services_public
SELECT 
  'Políticas RLS na tabela services_public' as teste,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'services_public';

-- 3. Verificar se há triggers na tabela services
SELECT 
  'Triggers na tabela services' as teste,
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'services'
AND event_object_schema = 'public';

-- 4. Verificar se há views que redirecionam para services_public
SELECT 
  'Views que podem redirecionar' as teste,
  table_name,
  table_type,
  view_definition
FROM information_schema.views 
WHERE table_schema = 'public' 
AND (table_name LIKE '%services%' OR view_definition LIKE '%services%');
