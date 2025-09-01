-- Criar perfil para o usuário pentecoffee que existe mas não tem profile
INSERT INTO public.profiles (id, email, first_name, last_name, is_vip)
VALUES ('86dc84d4-a405-4794-8eff-109a459793d2', 'pentecoffee@pentecoffee.com.br', 'Pentecoffee', '', false)
ON CONFLICT (id) DO NOTHING;

-- Remover a coluna is_vip da tabela services já que VIP será apenas para usuários
ALTER TABLE public.services DROP COLUMN IF EXISTS is_vip;