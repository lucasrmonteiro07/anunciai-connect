-- Script para verificar a estrutura da tabela services

-- 1. Verificar se a tabela services existe
SELECT 
  'Verificação tabela services' as teste,
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%services%';

-- 2. Verificar colunas da tabela services
SELECT 
  'Colunas da tabela services' as teste,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'services'
ORDER BY ordinal_position;

-- 3. Verificar se há views ou triggers
SELECT 
  'Views relacionadas a services' as teste,
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%services%'
AND table_type = 'VIEW';

-- 4. Verificar triggers na tabela services
SELECT 
  'Triggers na tabela services' as teste,
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'services'
AND event_object_schema = 'public';
