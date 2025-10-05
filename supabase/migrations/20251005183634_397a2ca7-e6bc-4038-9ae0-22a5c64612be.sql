-- Verificar e recriar a política de leitura pública
DROP POLICY IF EXISTS "Allow public read access to active services" ON public.services_public;

-- Criar política que permite acesso público COMPLETO (sem autenticação)
CREATE POLICY "Public read access"
ON public.services_public
FOR SELECT
TO anon, authenticated
USING (status = 'active');

-- Garantir que RLS está habilitado
ALTER TABLE public.services_public ENABLE ROW LEVEL SECURITY;