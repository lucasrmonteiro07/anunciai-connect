import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/header';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Crown, Flame } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [subscriptionChecked, setSubscriptionChecked] = useState(false);

  useEffect(() => {
    // Check subscription status after payment
    const checkSubscription = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        
        await supabase.functions.invoke('check-subscription', {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });
        setSubscriptionChecked(true);
        toast.success('Destaque ativado com sucesso!');
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    };

    checkSubscription();
  }, []);

  useEffect(() => {
    if (subscriptionChecked && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (subscriptionChecked && countdown === 0) {
      navigate('/gerenciar-pagamento');
    }
  }, [subscriptionChecked, countdown, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Pagamento Confirmado - Anunciai"
        description="Seu pagamento foi processado com sucesso. Agora você tem destaque!"
        canonical="https://anunciai.app.br/payment-success"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Pagamento Confirmado!</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Parabéns! Seu destaque foi ativado automaticamente
            </p>
            
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/5 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center mb-4">
                <Flame className="w-8 h-8 text-orange-500 mr-2" />
                <span className="text-xl font-semibold">Status Fogaréu Ativado</span>
              </div>
              <div className="space-y-2 text-left max-w-md mx-auto">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Destaque na busca ativado</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Badge Fogaréu adicionado</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Prioridade nos resultados</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Até 5 fotos por anúncio</span>
                </div>
              </div>
            </div>

            {subscriptionChecked && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-center">
                  Redirecionando para sua página de destaque em {countdown} segundos...
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/gerenciar-pagamento')}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                Ver Meu Status Fogaréu
              </Button>
              <Button 
                onClick={() => navigate('/meus-anuncios')}
                variant="outline"
                className="w-full"
              >
                Ver Meus Anúncios em Destaque
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full"
              >
                Voltar ao Início
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccess;