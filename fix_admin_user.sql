-- Script para garantir que o usuário anunciai@anunciai tenha permissões de admin

-- 1. Verificar se o usuário existe
DO $$
DECLARE
    user_id_val UUID;
BEGIN
    -- Buscar o ID do usuário
    SELECT id INTO user_id_val 
    FROM auth.users 
    WHERE email = 'anunciai@anunciai';
    
    IF user_id_val IS NULL THEN
        RAISE NOTICE 'Usuário anunciai@anunciai não encontrado';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Usuário encontrado com ID: %', user_id_val;
    
    -- 2. Verificar se já tem role de admin
    IF EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = user_id_val 
        AND role = 'admin'
    ) THEN
        RAISE NOTICE 'Usuário já tem role de admin';
    ELSE
        -- 3. Adicionar role de admin
        INSERT INTO public.user_roles (user_id, role)
        VALUES (user_id_val, 'admin');
        
        RAISE NOTICE 'Role de admin adicionado ao usuário';
    END IF;
    
    -- 4. Verificar se tem perfil
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id_val
    ) THEN
        -- Criar perfil se não existir
        INSERT INTO public.profiles (id, email, first_name, last_name)
        VALUES (user_id_val, 'anunciai@anunciai', 'Admin', 'Anunciai');
        
        RAISE NOTICE 'Perfil criado para o usuário';
    ELSE
        RAISE NOTICE 'Perfil já existe para o usuário';
    END IF;
    
    -- 5. Verificar permissões
    RAISE NOTICE 'Testando função has_role...';
    
    IF public.has_role(user_id_val, 'admin') THEN
        RAISE NOTICE 'Função has_role retorna TRUE para admin';
    ELSE
        RAISE NOTICE 'ERRO: Função has_role retorna FALSE para admin';
    END IF;
    
END $$;

-- 6. Verificar políticas RLS
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'user_roles', 'services', 'subscribers')
ORDER BY tablename, policyname;

-- 7. Teste final - verificar se o usuário pode ver dados
-- (Execute como o usuário anunciai@anunciai logado)
SELECT 'Teste de permissões' as teste;

-- Verificar se pode ver perfis
SELECT COUNT(*) as total_profiles FROM public.profiles;

-- Verificar se pode ver serviços
SELECT COUNT(*) as total_services FROM public.services;

-- Verificar se pode ver subscribers
SELECT COUNT(*) as total_subscribers FROM public.subscribers;
