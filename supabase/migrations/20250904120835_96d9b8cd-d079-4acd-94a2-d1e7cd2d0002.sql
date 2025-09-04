-- Adicionar colunas para flags CRIE e marketing na tabela profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS crie_member BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT false;

-- Adicionar comentários para documentar as colunas
COMMENT ON COLUMN public.profiles.crie_member IS 'Indica se o usuário é membro CRIE (S/N)';
COMMENT ON COLUMN public.profiles.marketing_consent IS 'Indica se o usuário aceita receber conteúdo de marketing (S/N)';