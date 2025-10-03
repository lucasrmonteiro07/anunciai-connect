import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/header';
import Footer from '@/components/ui/footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  CreditCard, 
  Calendar, 
  RefreshCw, 
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Flame
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
}

const GerenciarPagamento = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null
  });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Você precisa estar logado para acessar esta página');
        navigate('/login');
        return;
      }
      setUser(user);
      await checkSubscription();
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      navigate('/login');
    }
  };

  const checkSubscription = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Sessão expirada. Faça login novamente.');
        navigate('/login');
        return;
      }

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      if (error) {
        console.warn('⚠️ Edge Function não disponível:', error.message);
        toast.warning('Não foi possível verificar status da assinatura. Tente novamente mais tarde.');
        // Não retorna - continua com dados do banco
      }

      console.log('Subscription data received:', data);
      if (data) {
        setSubscriptionData({
          subscribed: data.subscribed || false,
          subscription_tier: data.subscription_tier || null,
          subscription_end: data.subscription_end || null
        });
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao verificar assinatura');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshSubscription = async () => {
    setRefreshing(true);
    await checkSubscription();
    setRefreshing(false);
    toast.success('Status da assinatura atualizado!');
  };

  const handleManageSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Sessão expirada. Faça login novamente.');
        return;
      }

      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      if (error) {
        console.error('Erro ao abrir portal do cliente:', error);
        toast.error('Erro ao abrir portal de gerenciamento');
        return;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao abrir portal de gerenciamento');
    }
  };

  const handleSubscribe = () => {
    navigate('/plano');
  };

  const handleCheckout = async (planType: 'monthly' | 'annual') => {
    if (!user) {
      toast.error('Você precisa estar logado para assinar o plano Destaque');
      navigate('/login');
      return;
    }

    try {
      // InfinitePay payment links
      const paymentUrl = planType === 'annual' 
        ? 'https://invoice.infinitepay.io/plans/aurorabusiness/PxA2x6V5x'
        : 'https://invoice.infinitepay.io/plans/aurorabusiness/hAKGBbJG3';

      // Open InfinitePay checkout in a new tab
      window.open(paymentUrl, '_blank');
      
      toast.success('Redirecionando para pagamento...', {
        description: 'Após o pagamento, envie seu comprovante para aurorabi@aurorabi.com.br'
      });
    } catch (error) {
      console.error('Error opening payment:', error);
      toast.error('Erro ao abrir página de pagamento. Tente novamente.');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusIcon = () => {
    if (subscriptionData.subscribed) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusText = () => {
    if (subscriptionData.subscribed) {
      return 'FOGARÉU';
    }
    return 'Inativo';
  };

  const getStatusColor = () => {
    if (subscriptionData.subscribed) {
      return 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-0';
    }
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getStatusBadge = () => {
    if (subscriptionData.subscribed) {
      return (
        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold flex items-center gap-1 border-0">
          <Flame className="h-3 w-3" />
          FOGARÉU
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-800 border-red-200">
        Inativo
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-24 bg-muted rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Gerenciar Pagamento - Anunciai"
        description="Gerencie sua assinatura Fogaréu e métodos de pagamento na plataforma Anunciai."
        canonical="https://anunciai.app.br/gerenciar-pagamento"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Gerenciar Pagamento</h1>
              <p className="text-muted-foreground">
                Gerencie sua assinatura e configurações de pagamento
              </p>
            </div>
            <Button
              onClick={handleRefreshSubscription}
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Atualizar Status
            </Button>
          </div>

          {/* Status da Assinatura */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                Status da Assinatura
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon()}
                  <span className="font-medium">Status:</span>
                  {getStatusBadge()}
                </div>
                {subscriptionData.subscription_tier && (
                  <Badge variant="secondary">
                    {subscriptionData.subscription_tier}
                  </Badge>
                )}
              </div>

              {subscriptionData.subscribed && subscriptionData.subscription_end && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Renovação em: {formatDate(subscriptionData.subscription_end)}
                  </span>
                </div>
              )}

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Benefícios do Plano Fogaréu:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✅ Anúncios destacados no topo das buscas</li>
                  <li>✅ Até 5 fotos por anúncio (vs 1 no Plano Benção)</li>
                  <li>✅ Selo de destaque nos seus anúncios</li>
                  <li>✅ Prioridade no suporte</li>
                  <li>✅ Estatísticas detalhadas de visualizações</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Gerenciar Assinatura */}
            {subscriptionData.subscribed ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Gerenciar Assinatura
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Altere seu método de pagamento, atualize informações de cobrança ou cancele sua assinatura.
                  </p>
                  <Button 
                    onClick={handleManageSubscription}
                    className="w-full"
                    variant="outline"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir Portal do Cliente
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-primary" />
                    Upgrade para Plano Fogaréu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Destaque seus anúncios e alcance mais clientes com o Plano Fogaréu.
                  </p>
                  
                  {/* Opções de Plano */}
                  <div className="space-y-3">
                    {/* Plano Mensal */}
                    <div className="border rounded-lg p-4 bg-gradient-to-r from-orange-500/5 to-red-500/5 border-orange-200">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-2xl font-bold text-orange-600">Plano Mensal</h3>
                          <p className="text-3xl font-bold text-orange-500">R$ 14,90</p>
                          <p className="text-xs text-muted-foreground">por mês</p>
                        </div>
                        <Flame className="h-6 w-6 text-orange-500" />
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 p-2 bg-blue-50 border border-blue-200 rounded">
                        📧 Após o pagamento, envie seu comprovante para <strong>aurorabi@aurorabi.com.br</strong>
                      </p>
                      <Button 
                        onClick={() => handleCheckout('monthly')}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0"
                        disabled={loading}
                      >
                        {loading ? 'Processando...' : 'Assinar Mensal'}
                      </Button>
                    </div>

                    {/* Plano Anual */}
                    <div className="border rounded-lg p-4 bg-gradient-to-r from-green-500/5 to-emerald-500/5 border-green-200 relative">
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        ECONOMIZE 20%
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-2xl font-bold text-green-600">Plano Anual</h3>
                          <p className="text-3xl font-bold text-green-500">R$ 11,90</p>
                          <p className="text-xs text-muted-foreground">por mês (R$ 142,80/ano)</p>
                        </div>
                        <Crown className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 p-2 bg-blue-50 border border-blue-200 rounded">
                        📧 Após o pagamento, envie seu comprovante para <strong>aurorabi@aurorabi.com.br</strong>
                      </p>
                      <Button 
                        onClick={() => handleCheckout('annual')}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0"
                        disabled={loading}
                      >
                        {loading ? 'Processando...' : 'Assinar Anual'}
                      </Button>
                    </div>
                  </div>

                  {/* Link para página Destaque */}
                  <div className="text-center pt-2">
                    <Button 
                      onClick={handleSubscribe}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Ver mais detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Histórico de Pagamentos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Histórico
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Visualize seu histórico de pagamentos e faturas.
                </p>
                <Button 
                  onClick={handleManageSubscription}
                  variant="outline"
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver Histórico
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Informações Importantes */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Importantes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  • O status da assinatura é atualizado automaticamente, mas pode levar alguns minutos para refletir mudanças.
                </p>
                <p>
                  • Para suporte relacionado a pagamentos, entre em contato através da página de contato.
                </p>
                <p>
                  • Cancelamentos entram em vigor no final do período de cobrança atual.
                </p>
                <p>
                  • Todos os pagamentos são processados de forma segura através do Stripe.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GerenciarPagamento;