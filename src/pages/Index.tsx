import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/header';
import Footer from '@/components/ui/footer';
import HeroSection from '@/components/ui/hero-section';
import SearchBar from '@/components/ui/search-bar';
import ServiceCard, { ServiceData } from '@/components/ui/service-card';
import ServicesMap from '@/components/ui/services-map';
import { Button } from '@/components/ui/button';
import { Filter, Map as MapIcon, Flame, RefreshCw } from 'lucide-react';
import SEO from '@/components/SEO';
import ChristianAd from '@/components/ui/christian-ad';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { User, Session } from '@supabase/supabase-js';
import { useServices } from '@/hooks/useServices';
import DebugPanel from '@/components/DebugPanel';

// Service categories and trusted community indicators remain

const Index = () => {
  const navigate = useNavigate();
  const { services, isLoading, refreshServices } = useServices();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedProductType, setSelectedProductType] = useState('all');
  const [filteredServices, setFilteredServices] = useState<ServiceData[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      // Check VIP status if user is logged in
      if (session?.user) {
        await checkVipStatus(session.access_token);
      }
    };
    
    checkAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check VIP status when auth state changes
        if (session?.user) {
          await checkVipStatus(session.access_token);
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);

  const checkVipStatus = async (accessToken: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (error) {
        console.warn('⚠️ Edge Function check-subscription não disponível:', error.message);
        // Não bloqueia a aplicação se a Edge Function não estiver disponível
        return;
      }

      console.log('✅ VIP Status checked:', data);
      
      // Reload services to get updated VIP status
      if (data?.subscribed) {
        await refreshServices();
      }
    } catch (error: any) {
      console.warn('⚠️ Erro ao verificar status VIP (não crítico):', error.message);
      // Não propaga erro para não quebrar a aplicação
    }
  };

  // Atualizar quando os dados dos serviços mudarem
  useEffect(() => {
    handleSearch();
  }, [services, searchTerm, selectedCategory, selectedLocation, selectedCity, selectedProductType, selectedType]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshServices();
      toast.success('Dados atualizados com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar dados');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSearch = useCallback(() => {
    let filtered = services;

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(service => 
        service.title.toLowerCase().includes(searchLower) ||
        service.description.toLowerCase().includes(searchLower) ||
        service.category.toLowerCase().includes(searchLower) ||
        service.denomination.toLowerCase().includes(searchLower)
      );
    }

    if (selectedProductType !== 'all') {
      filtered = filtered.filter(service => 
        service.product_type === selectedProductType
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(service => 
        service.type.toLowerCase() === selectedType.toLowerCase()
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => 
        service.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedLocation !== 'all') {
      filtered = filtered.filter(service => 
        service.location.uf.toLowerCase() === selectedLocation.toLowerCase()
      );
    }

    if (selectedCity !== 'all') {
      filtered = filtered.filter(service => 
        service.location.city.toLowerCase() === selectedCity.toLowerCase()
      );
    }

    filtered.sort((a, b) => {
      if (a.isVip && !b.isVip) return -1;
      if (!a.isVip && b.isVip) return 1;
      return 0;
    });

    setFilteredServices(filtered);
  }, [services, searchTerm, selectedCategory, selectedLocation, selectedCity, selectedType, selectedProductType]);

  const handleDirectCheckout = async (planType: 'monthly' | 'annual') => {
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

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Anunciai - Serviços e Empreendimentos Cristãos"
        description="Encontre prestadores cristãos qualificados e empreendimentos com destaque. Busca por categoria e localização."
        canonical="https://anunciai.app.br/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Anunciai",
          url: "https://anunciai.app.br/"
        }}
      />
      <main role="main" aria-label="Página principal do Anunciai">
      <Header />
      <HeroSection />
      
      {/* Seção de Informações dos Planos - Melhor Estruturada */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-orange-500/5" aria-labelledby="plans-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 id="plans-heading" className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              Escolha o Plano Ideal para Seu Negócio
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Compare os benefícios e escolha o plano que melhor se adapta às suas necessidades de negócio
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-6xl mx-auto">
            {/* Plano Benção - Melhorado */}
            <div className="bg-card rounded-xl p-8 border-2 border-border hover:border-primary/50 transition-all duration-300 relative">
              <div className="text-center">
                <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4 inline-block">
                  PLANO GRATUITO
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">Plano Benção</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-primary">R$ 0</span>
                  <p className="text-muted-foreground mt-1">Para sempre</p>
                  <p className="text-xs text-muted-foreground mt-2">Sem taxas ocultas</p>
                </div>
                <ul className="text-left space-y-3 mb-6">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    1 foto do seu negócio
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Listagem básica
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Informações de contato
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Localização no mapa
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <div className="w-2 h-2 bg-muted rounded-full mr-3"></div>
                    Sem destaque nas pesquisas
                  </li>
                </ul>
                <Button 
                  onClick={() => navigate('/anunciar')}
                  variant="outline"
                  className="w-full border-primary/30 hover:border-primary hover:bg-primary/10"
                >
                  Começar Grátis
                </Button>
              </div>
            </div>

            {/* Plano Fogaréu Mensal - Melhorado */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-8 text-white relative transform hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="absolute top-4 right-4">
                <div className="bg-white text-orange-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Flame className="h-3 w-3" />
                  POPULAR
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 inline-block">
                  PLANO MENSAL
                </div>
                <h3 className="text-2xl font-bold mb-2">Plano Fogaréu</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold">R$ 14,90</span>
                  <p className="mt-1 opacity-90">por mês</p>
                  <p className="text-xs opacity-75 mt-2">Cancele quando quiser</p>
                </div>
                <ul className="text-left space-y-3 mb-6">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    5 fotos do seu negócio
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Destaque nas buscas
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Contorno dourado nos anúncios
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Badge Fogaréu especial
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Aparece primeiro na busca
                  </li>
                </ul>
                <Button 
                  variant="secondary" 
                  className="w-full bg-white text-orange-600 hover:bg-orange-50 mb-3"
                  onClick={() => handleDirectCheckout('monthly')}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? 'Processando...' : '🔥 Tornar-se Fogaréu'}
                </Button>
              </div>
            </div>

            {/* Plano Fogaréu Anual - Melhorado */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-8 text-white relative transform hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="absolute top-4 right-4">
                <div className="bg-white text-green-600 px-3 py-1 rounded-full text-xs font-bold">
                  ECONOMIZE 20%
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 inline-block">
                  PLANO ANUAL
                </div>
                <h3 className="text-2xl font-bold mb-2">Plano Fogaréu Anual</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold">R$ 11,90</span>
                  <p className="mt-1 opacity-90">por mês</p>
                  <p className="text-sm opacity-75">(R$ 142,80/ano)</p>
                  <p className="text-xs opacity-75 mt-2">Economia de R$ 36/ano</p>
                </div>
                 <ul className="text-left space-y-3 mb-6">
                   <li className="flex items-center">
                     <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                     5 fotos do seu negócio
                   </li>
                   <li className="flex items-center">
                     <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                     Destaque nas buscas
                   </li>
                   <li className="flex items-center">
                     <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                     Contorno dourado nos anúncios
                   </li>
                   <li className="flex items-center">
                     <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                     Badge Fogaréu especial
                   </li>
                   <li className="flex items-center">
                     <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                     Aparece primeiro na busca
                   </li>
                   <li className="flex items-center">
                     <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                     Adicional de consultoria de anúncios gratuita
                   </li>
                   <li className="flex items-center">
                     <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                     Pra você vender mais e com mais assertividade
                   </li>
                 </ul>
                <Button 
                  variant="secondary" 
                  className="w-full bg-white text-green-600 hover:bg-green-50 mb-3"
                  onClick={() => handleDirectCheckout('annual')}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? 'Processando...' : '💰 Escolher Anual'}
                </Button>
              </div>
            </div>
          </div>

          {/* Botões de Ação Centralizados */}
          <div className="text-center space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <Button 
                onClick={() => navigate('/anunciar')}
                variant="outline"
                size="lg"
                className="px-8 py-3"
              >
                🆓 Começar Grátis
              </Button>
              <Button 
                onClick={() => navigate('/gerenciar-pagamento')}
                size="lg"
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                🔥 Ver Todos os Planos
              </Button>
              <Button 
                onClick={() => navigate('/gerenciar-pagamento')}
                variant="secondary"
                size="lg"
                className="px-8 py-3"
              >
                💳 Gerenciar Pagamento
              </Button>
            </div>
            {!user && (
              <p className="text-muted-foreground">
                Já tem uma conta? <span className="text-primary cursor-pointer hover:underline" onClick={() => navigate('/login')}>Faça login</span> para gerenciar seus anúncios
              </p>
            )}
          </div>

          {/* Anúncio discreto após planos - apenas se houver conteúdo suficiente */}
          {services.length > 0 && (
            <div className="py-8">
              <div className="max-w-md mx-auto">
                <ChristianAd slot="7645068919" className="rounded-lg border border-border/50" />
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Search Section */}
      <section className="py-12 bg-card/30" data-search-section>
        <div className="container mx-auto px-4">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedProductType={selectedProductType}
            setSelectedProductType={setSelectedProductType}
            onSearch={handleSearch}
            services={services}
          />
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12" aria-labelledby="services-heading">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 id="services-heading" className="text-3xl font-bold mb-2">
                Serviços em Destaque
                {filteredServices.length > 0 && (
                  <span className="text-lg font-normal text-muted-foreground ml-2">
                    ({filteredServices.length} {filteredServices.length === 1 ? 'resultado' : 'resultados'})
                  </span>
                )}
              </h2>
              <p className="text-muted-foreground">
                Encontre profissionais, empreendimentos e produtos cristãos qualificados em sua região
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowMap(!showMap)}
                className={showMap ? "bg-primary text-primary-foreground" : ""}
              >
                <MapIcon className="h-4 w-4 mr-2" />
                {showMap ? 'Ocultar Mapa' : 'Ver no Mapa'}
              </Button>
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>

          {/* Map View */}
          {showMap && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Mapa dos Serviços</h3>
              <ServicesMap 
                services={filteredServices}
                height="400px"
              />
            </div>
          )}

          <div className="flex items-center justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Atualizando...' : 'Atualizar'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div key={`skeleton-${index}`} className="animate-pulse">
                  <div className="bg-muted h-48 rounded-t-lg"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                  </div>
                </div>
              ))
            ) : (
              filteredServices.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service}
                  onClick={() => {
                    console.log('Navegando para:', `/anuncio/${service.id}`);
                    navigate(`/anuncio/${service.id}`);
                  }}
                />
              ))
            )}
          </div>

          {/* Anúncio discreto após grid de serviços - apenas se houver conteúdo suficiente */}
          {filteredServices.length > 6 && !isLoading && (
            <div className="mt-8 max-w-lg mx-auto">
              <ChristianAd slot="7295932163" className="rounded-lg border border-border/50" />
            </div>
          )}

          {filteredServices.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">Nenhum serviço encontrado</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || selectedCategory !== 'all' || selectedLocation !== 'all' || selectedCity !== 'all'
                    ? 'Tente ajustar os filtros de busca para encontrar mais resultados.'
                    : 'Ainda não há serviços cadastrados nesta categoria.'
                  }
                </p>
                {(searchTerm || selectedCategory !== 'all' || selectedLocation !== 'all' || selectedCity !== 'all') && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setSelectedLocation('all');
                      setSelectedCity('all');
                      setFilteredServices(services);
                    }}
                  >
                    Limpar Filtros
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
      </main>
      
      {/* Debug Panel - Temporário para diagnosticar problema */}
      <DebugPanel />
    </div>
  );
};

export default Index;
