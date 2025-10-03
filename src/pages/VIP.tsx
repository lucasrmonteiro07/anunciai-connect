import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Zap, Star } from "lucide-react";

const VIP = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Planos de Destaque - Anunciai"
        description="Destaque seu anúncio e apareça primeiro nas buscas. Planos mensais e anuais com economia."
        canonical="https://anunciai.app.br/plano"
      />
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-6">
            <Crown className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium text-orange-500">
              Destaque seu Negócio
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Planos de <span className="gold-accent">Destaque</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Apareça primeiro nas buscas e alcance mais clientes. 
            Escolha o plano ideal para o seu negócio.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {/* Plano Gratuito */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-muted-foreground" />
                Plano Gratuito
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="text-3xl font-bold mb-2">R$ 0</div>
                <div className="text-sm text-muted-foreground">Para sempre</div>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm">Cadastro básico do anúncio</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm">Aparece nas buscas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm">Localização no mapa</span>
                </li>
                <li className="flex items-start gap-2 opacity-50">
                  <span className="text-sm">✗ Sem destaque nas pesquisas</span>
                </li>
              </ul>

              <Button 
                onClick={() => navigate('/anunciar')}
                variant="outline"
                className="w-full"
              >
                Começar Grátis
              </Button>
            </CardContent>
          </Card>

          {/* Plano Fogaréu Mensal */}
          <Card className="border-2 border-orange-500 relative shadow-xl">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Mais Popular
              </span>
            </div>
            
            <CardHeader className="bg-orange-500/5">
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <Zap className="h-6 w-6" />
                Fogaréu Mensal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-8">
              <div>
                <div className="text-4xl font-bold mb-2 text-orange-600">R$ 19,90</div>
                <div className="text-sm text-muted-foreground">por mês</div>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold">Tudo do plano gratuito</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm">⭐ Selo VIP de destaque</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm">🔥 Aparece PRIMEIRO nas buscas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm">🎨 Visual premium no destaque</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm">📱 Mais visualizações</span>
                </li>
              </ul>

              <Button 
                onClick={() => navigate('/gerenciar-pagamento')}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                Assinar Mensal
              </Button>
            </CardContent>
          </Card>

          {/* Plano Fogaréu Anual */}
          <Card className="border-2 border-orange-400 shadow-lg">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Economia de R$ 40
              </span>
            </div>
            
            <CardHeader className="bg-orange-500/5">
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <Crown className="h-6 w-6" />
                Fogaréu Anual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-8">
              <div>
                <div className="text-4xl font-bold mb-1 text-orange-600">R$ 199</div>
                <div className="text-sm text-muted-foreground">por ano</div>
                <div className="text-xs text-green-600 font-semibold mt-1">
                  Equivale a R$ 16,58/mês
                </div>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold">Tudo do plano mensal</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm">💰 Economia de R$ 40/ano</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm">🎯 12 meses de destaque</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm">🚀 Melhor custo-benefício</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm">📈 Visibilidade contínua</span>
                </li>
              </ul>

              <Button 
                onClick={() => navigate('/gerenciar-pagamento')}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                Assinar Anual
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="bg-muted/30 rounded-xl p-8 max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-center mb-6">
            Por que escolher o Plano Fogaréu?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="bg-orange-500/10 p-2 rounded-lg">
                <Zap className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Mais Visibilidade</h3>
                <p className="text-sm text-muted-foreground">
                  Seu anúncio aparece primeiro nas buscas, aumentando as chances de contato
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-orange-500/10 p-2 rounded-lg">
                <Star className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Selo de Destaque</h3>
                <p className="text-sm text-muted-foreground">
                  Visual premium que transmite confiança e profissionalismo
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-orange-500/10 p-2 rounded-lg">
                <Crown className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Prioridade Total</h3>
                <p className="text-sm text-muted-foreground">
                  Sempre no topo dos resultados de busca e categorias
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-orange-500/10 p-2 rounded-lg">
                <Check className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Resultados Comprovados</h3>
                <p className="text-sm text-muted-foreground">
                  Anúncios VIP recebem até 5x mais visualizações
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Ainda não tem uma conta?
          </p>
          <Button 
            onClick={() => navigate('/login')}
            variant="outline"
            size="lg"
          >
            Criar Conta Grátis
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VIP;
