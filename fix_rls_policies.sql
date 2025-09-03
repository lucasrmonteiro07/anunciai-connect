-- Script para verificar e corrigir políticas RLS

-- 1. Verificar se RLS está habilitado nas tabelas
SELECT 
  'Verificação RLS habilitado' as teste,
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'user_roles', 'services', 'subscribers');

-- 2. Verificar políticas existentes
SELECT 
  'Políticas existentes' as teste,
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

-- 3. Recriar políticas para profiles se necessário
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- 4. Recriar políticas para user_roles se necessário
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. Recriar políticas para services se necessário
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;
DROP POLICY IF EXISTS "Users can manage their own services" ON public.services;
DROP POLICY IF EXISTS "Admins can manage all services" ON public.services;

CREATE POLICY "Anyone can view active services"
  ON public.services FOR SELECT
  USING (status = 'active');

CREATE POLICY "Users can manage their own services"
  ON public.services FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all services"
  ON public.services FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- 6. Recriar políticas para subscribers se necessário
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscribers;
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON public.subscribers;
DROP POLICY IF EXISTS "Users can update their own subscription email" ON public.subscribers;

CREATE POLICY "Users can view their own subscriptions"
  ON public.subscribers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions"
  ON public.subscribers FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update their own subscription email"
  ON public.subscribers FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND OLD.stripe_customer_id = NEW.stripe_customer_id);

-- 7. Verificar se as políticas foram criadas corretamente
SELECT 
  'Políticas após correção' as teste,
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
