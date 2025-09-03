-- Script para verificar colunas da tabela services_public

-- 1. Verificar colunas da tabela services_public
SELECT 
  'Colunas da tabela services_public' as teste,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'services_public'
ORDER BY ordinal_position;

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
