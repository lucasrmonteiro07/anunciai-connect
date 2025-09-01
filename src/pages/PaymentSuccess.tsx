import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/header';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check subscription status after payment
    const checkSubscription = async () => {
      try {
        await supabase.functions.invoke('check-subscription');
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    };

    checkSubscription();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Pagamento Confirmado - Anunciai"
        description="Seu pagamento foi processado com sucesso. Agora você é VIP!"
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
              Parabéns! Agora você é um usuário VIP
            </p>
            
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center mb-4">
                <Crown className="w-8 h-8 text-primary mr-2" />
                <span className="text-xl font-semibold">Status VIP Ativado</span>
              </div>
              <div className="space-y-2 text-left max-w-md mx-auto">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Destaque na busca ativado</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Badge VIP adicionado</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Prioridade nos resultados</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/meus-anuncios')}
                className="w-full"
              >
                Ver Meus Anúncios VIP
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