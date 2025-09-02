import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/header';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, Star, Zap, Flame } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

const VIP = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          checkSubscription();
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkSubscription();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      setSubscriptionStatus(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const handleCheckout = async (planType: 'monthly' | 'annual') => {
    if (!user) {
      toast.error('Você precisa estar logado para assinar o plano VIP');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (subscriptionStatus?.subscribed) {
    return (
      <div className="min-h-screen bg-background">
        <SEO
          title="VIP Ativo - Anunciai"
          description="Sua assinatura VIP está ativa. Aproveite todos os benefícios."
          canonical="https://anunciai.app.br/vip"
        />
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gradient-to-br from-primary to-primary-foreground rounded-xl p-8 text-white mb-8">
              <Flame className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Você é Fogaréu!</h1>
              <p className="text-xl opacity-90 mb-4">Sua assinatura está ativa</p>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {subscriptionStatus.subscription_tier}
              </Badge>
            </div>
            
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Benefícios Ativos</h2>
              <div className="space-y-3 text-left">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Destaque na busca</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Badge Fogaréu especial</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Aparece primeiro nos resultados</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Até 5 fotos nos anúncios</span>
                </div>
              </div>
            </Card>

            <div className="mt-8 space-y-4">
              <Button onClick={() => navigate('/meus-anuncios')} className="w-full">
                Ver Meus Anúncios
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                Voltar ao Início
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Torne-se VIP - Anunciai"
        description="Destaque seus anúncios com o plano VIP. R$ 14,90/mês ou R$ 11,90/mês no plano anual."
        canonical="https://anunciai.app.br/vip"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Flame className="w-12 h-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold">Escolha seu Plano</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Destaque seus anúncios e apareça primeiro na busca
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="p-8 border-2 hover:border-primary/50 transition-colors">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-muted-foreground mr-2" />
                <h3 className="text-2xl font-bold">Plano Benção (Free)</h3>
              </div>
              <p className="text-4xl font-bold text-muted-foreground mb-2">Gratuito</p>
              <p className="text-muted-foreground mb-6">para sempre</p>
              
              <div className="space-y-3 mb-8 text-left">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>1 foto por anúncio</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Listagem básica</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Sem destaque na busca</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Suporte comunidade</span>
                </div>
              </div>
              
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => navigate('/anunciar')}
              >
                Anunciar Grátis
              </Button>
            </div>
          </Card>

          {/* VIP Plan */}
          <Card className="p-8 border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden">
            <Badge className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500">
              Mais Popular
            </Badge>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 pointer-events-none" />
            <div className="text-center relative z-10">
              <div className="flex items-center justify-center mb-4">
                <Flame className="w-8 h-8 text-orange-500 mr-2" />
                <h3 className="text-2xl font-bold">Plano Fogaréu (Destaque)</h3>
              </div>
              <div className="mb-6">
                <p className="text-4xl font-bold text-orange-500">R$ 14,90</p>
                <p className="text-muted-foreground">por mês</p>
              </div>
              
              <div className="space-y-3 mb-8 text-left">
                <div className="flex items-center">
                  <Flame className="w-5 h-5 text-orange-500 mr-3" />
                  <span>Destaque na busca</span>
                </div>
                <div className="flex items-center">
                  <Flame className="w-5 h-5 text-orange-500 mr-3" />
                  <span>Badge Fogaréu especial</span>
                </div>
                <div className="flex items-center">
                  <Flame className="w-5 h-5 text-orange-500 mr-3" />
                  <span>Aparece primeiro</span>
                </div>
                <div className="flex items-center">
                  <Flame className="w-5 h-5 text-orange-500 mr-3" />
                  <span>Até 5 fotos</span>
                </div>
                <div className="flex items-center">
                  <Flame className="w-5 h-5 text-orange-500 mr-3" />
                  <span>Contorno dourado</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0"
                onClick={() => handleCheckout('monthly')}
                disabled={loading || !user}
              >
                {loading ? 'Processando...' : 'Assinar Fogaréu'}
              </Button>
            </div>
          </Card>
        </div>

        {!user && (
          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">
              Você precisa estar logado para assinar o plano Fogaréu
            </p>
            <Button variant="outline" onClick={() => navigate('/login')}>
              Fazer Login
            </Button>
          </div>
        )}

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-6">Por que ser Fogaréu?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Mais Visibilidade</h3>
              <p className="text-sm text-muted-foreground">
                Seus anúncios aparecem primeiro nos resultados de busca
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Badge Especial</h3>
              <p className="text-sm text-muted-foreground">
                Badge Fogaréu que transmite confiança e profissionalismo
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Mais Contatos</h3>
              <p className="text-sm text-muted-foreground">
                Aumente suas chances de ser contactado pelos clientes
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VIP;