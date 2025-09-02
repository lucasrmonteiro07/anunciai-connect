-- Remove políticas perigosamente permissivas
DROP POLICY IF EXISTS "Edge functions can insert subscriptions" ON public.subscribers;
DROP POLICY IF EXISTS "Edge functions can update subscriptions" ON public.subscribers;

-- As funções edge devem usar a service role key para bypass do RLS
-- Usuários só podem ver suas próprias assinaturas (política SELECT já existe e está correta)

-- Adicionar política para admins verem todas as assinaturas
CREATE POLICY "Admins can view all subscriptions" ON public.subscribers
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Política para usuários atualizarem apenas seus próprios dados de assinatura (casos específicos)
CREATE POLICY "Users can update their own subscription email" ON public.subscribers
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id AND OLD.stripe_customer_id = NEW.stripe_customer_id);

-- Garantir que usuários não podem inserir dados diretamente (apenas edge functions via service role)
-- Não adicionamos política de INSERT para usuários normais

-- Adicionar índices para performance
CREATE INDEX IF NOT EXISTS idx_subscribers_user_id ON public.subscribers(user_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_stripe_customer_id ON public.subscribers(stripe_customer_id);