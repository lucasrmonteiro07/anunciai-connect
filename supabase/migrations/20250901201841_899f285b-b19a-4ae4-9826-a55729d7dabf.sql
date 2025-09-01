-- Criar perfil para o usuário pentecoffee que existe mas não tem profile
INSERT INTO public.profiles (id, email, first_name, last_name, is_vip)
VALUES ('86dc84d4-a405-4794-8eff-109a459793d2', 'pentecoffee@pentecoffee.com.br', 'Pentecoffee', '', false)
ON CONFLICT (id) DO NOTHING;

-- Remover a view services_public temporariamente
DROP VIEW IF EXISTS public.services_public;

-- Remover a coluna is_vip da tabela services
ALTER TABLE public.services DROP COLUMN IF EXISTS is_vip;

-- Recriar a view services_public sem a coluna is_vip (VIP agora é apenas do usuário)
CREATE VIEW public.services_public AS 
SELECT 
  s.id,
  s.title,
  s.description,
  s.category,
  s.type,
  s.denomination,
  s.city,
  s.uf,
  s.latitude,
  s.longitude,
  s.logo_url,
  s.images,
  s.instagram,
  s.facebook,
  s.website,
  s.created_at,
  s.updated_at,
  p.is_vip  -- VIP agora vem do perfil do usuário
FROM public.services s
LEFT JOIN public.profiles p ON s.user_id = p.id
WHERE s.status = 'active';