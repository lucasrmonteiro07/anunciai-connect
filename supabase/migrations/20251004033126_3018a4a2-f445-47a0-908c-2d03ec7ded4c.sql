-- Remover políticas antigas da tabela services_public
DROP POLICY IF EXISTS "Public can view active services" ON public.services_public;
DROP POLICY IF EXISTS "Block all inserts to services_public" ON public.services_public;
DROP POLICY IF EXISTS "Block all updates to services_public" ON public.services_public;
DROP POLICY IF EXISTS "Block all deletes to services_public" ON public.services_public;

-- Criar nova política que permite leitura pública de serviços ativos
CREATE POLICY "Allow public read access to active services"
ON public.services_public
FOR SELECT
USING (status = 'active');

-- Garantir que RLS está habilitado
ALTER TABLE public.services_public ENABLE ROW LEVEL SECURITY;

-- Adicionar comentário explicativo
COMMENT ON POLICY "Allow public read access to active services" ON public.services_public IS 
'Permite que qualquer pessoa (autenticada ou não) veja serviços com status ativo';