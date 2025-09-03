import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/header';
import Footer from '@/components/ui/footer';
import HeroSection from '@/components/ui/hero-section';
import SearchBar from '@/components/ui/search-bar';
import ServiceCard, { ServiceData } from '@/components/ui/service-card';
import MapFilter from '@/components/ui/map-filter';
import { Button } from '@/components/ui/button';
import { Filter, Map as MapIcon } from 'lucide-react';
import SEO from '@/components/SEO';
import ChristianAd from '@/components/ui/christian-ad';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Service categories and trusted community indicators remain

const Index = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [filteredServices, setFilteredServices] = useState<ServiceData[]>([]);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [services, searchTerm, selectedCategory, selectedLocation]);

  const loadServices = async () => {
    try {
      // First get services data
      const { data: servicesData, error: servicesError } = await supabase
        .from('services_public')
        .select('*')
        .order('created_at', { ascending: false });

      if (servicesError) {
        console.error('Error fetching services:', servicesError);
        setServices([]);
        setFilteredServices([]);
        return;
      }

      // Get VIP status for each service by checking user profiles
      let servicesWithVip: ServiceData[] = [];
      
      if (servicesData && servicesData.length > 0) {
        // Get unique user IDs from services
        const userIds = [...new Set(servicesData.map(s => s.id).filter(Boolean))];
        
        // Get VIP status from profiles table (using a separate query due to privacy constraints)
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, is_vip')
          .in('id', userIds);

        const vipMap = new Map((profilesData || []).map(p => [p.id, p.is_vip]));

        // Transform Supabase data to ServiceData format
        servicesWithVip = servicesData.map(service => {
          console.log('Serviço carregado:', {
            title: service.title,
            logo_url: service.logo_url,
            images: service.images,
            hasImages: service.images && service.images.length > 0
          });
          
          return {
            id: service.id,
            title: service.title,
            description: service.description || '',
            category: service.category,
            type: service.type as 'prestador' | 'empreendimento',
            location: { 
              city: service.city, 
              uf: service.uf,
              latitude: service.latitude ? Number(service.latitude) : undefined,
              longitude: service.longitude ? Number(service.longitude) : undefined,
              address: service.address || undefined
            },
            contact: { 
              phone: '', 
              email: '',
              whatsapp: undefined
            },
            logo: service.logo_url || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
            images: service.images || [],
            isVip: vipMap.get(service.id) || false,
            denomination: service.denomination || '',
            ownerName: '',
            socialMedia: {
              instagram: service.instagram || undefined,
              facebook: service.facebook || undefined,
              website: service.website || undefined
            }
          };
        });
      }

      // Sort with VIP services first
      const sortedServices = servicesWithVip.sort((a, b) => {
        if (a.isVip && !b.isVip) return -1;
        if (!a.isVip && b.isVip) return 1;
        return 0;
      });

      // Use only real services data (no mock data)
      setServices(sortedServices);
      setFilteredServices(sortedServices);
    } catch (error) {
      console.error('Error loading services:', error);
      setServices([]);
      setFilteredServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(service => 
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
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

    // Sort VIP first
    filtered.sort((a, b) => {
      if (a.isVip && !b.isVip) return -1;
      if (!a.isVip && b.isVip) return 1;
      return 0;
    });

    setFilteredServices(filtered);
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
      <Header />
      <HeroSection />
      
      {/* Promotional Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Anuncie Seu Negócio</h2>
            <p className="text-xl text-muted-foreground">Conecte-se com a comunidade cristã</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plano Benção (Free) */}
            <div className="bg-card rounded-xl p-8 border-2 border-border hover:border-primary/50 transition-colors">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2 text-primary">Plano Benção (Free)</h3>
                <p className="text-4xl font-bold text-primary mb-4">R$ 0</p>
                <p className="text-muted-foreground mb-6">Para sempre</p>
                <ul className="text-left space-y-3 mb-8">
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
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-muted rounded-full mr-3"></div>
                    <span className="text-muted-foreground">Sem destaque nas pesquisas</span>
                  </li>
                </ul>
                <Button className="w-full" onClick={() => navigate('/anunciar')}>
                  Começar Grátis
                </Button>
              </div>
            </div>

            {/* Plano Fogaréu (Destaque) */}
            <div className="fogareu-card bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-8 border-2 border-orange-400 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white text-orange-600 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                🔥 FOGARÉU
              </div>
              <div className="text-center text-white">
                <h3 className="text-2xl font-bold mb-2">Plano Fogaréu (Destaque)</h3>
                <div className="mb-4">
                  <p className="text-3xl font-bold text-orange-500">R$ 14,90</p>
                  <p className="text-sm text-muted-foreground">por mês</p>
                  <p className="text-sm text-muted-foreground mt-2">ou R$ 11,90/mês no plano anual (R$ 142,80/ano)</p>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    5 fotos do seu negócio
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Destaque nas pesquisas
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
                <div className="space-y-2">
                  <Button 
                    variant="secondary" 
                    className="w-full bg-white text-orange-600 hover:bg-orange-50"
                    onClick={() => navigate('/plano')}
                  >
                    🔥 Tornar-se Fogaréu
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30"
                    onClick={() => navigate('/gerenciar-pagamento')}
                  >
                    💳 Gerenciar Pagamento
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Seção de Informações dos Planos */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Escolha o Plano Ideal para Seu Negócio</h3>
              <p className="text-muted-foreground">
                Compare os benefícios e escolha o plano que melhor se adapta às suas necessidades
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Plano Benção - Resumo */}
              <div className="bg-card rounded-lg p-6 border border-border">
                <div className="text-center">
                  <h4 className="text-lg font-bold text-primary mb-2">Plano Benção</h4>
                  <p className="text-2xl font-bold text-primary mb-2">R$ 0</p>
                  <p className="text-sm text-muted-foreground mb-4">Para sempre</p>
                  <ul className="text-sm text-left space-y-2">
                    <li>✅ 1 foto</li>
                    <li>✅ Listagem básica</li>
                    <li>✅ Contato</li>
                    <li>✅ Localização</li>
                  </ul>
                </div>
              </div>

              {/* Plano Fogaréu Mensal - Resumo */}
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-lg p-6 text-white">
                <div className="text-center">
                  <h4 className="text-lg font-bold mb-2">Plano Fogaréu</h4>
                  <p className="text-2xl font-bold mb-2">R$ 14,90</p>
                  <p className="text-sm mb-4">por mês</p>
                  <ul className="text-sm text-left space-y-2">
                    <li>✅ 5 fotos</li>
                    <li>✅ Destaque nas buscas</li>
                    <li>✅ Badge especial</li>
                    <li>✅ Prioridade</li>
                  </ul>
                </div>
              </div>

              {/* Plano Fogaréu Anual - Resumo */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg p-6 text-white relative">
                <div className="absolute top-2 right-2 bg-white text-green-600 px-2 py-1 rounded-full text-xs font-bold">
                  ECONOMIZE 20%
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-bold mb-2">Plano Fogaréu Anual</h4>
                  <p className="text-2xl font-bold mb-2">R$ 11,90</p>
                  <p className="text-sm mb-4">por mês (R$ 142,80/ano)</p>
                  <ul className="text-sm text-left space-y-2">
                    <li>✅ 5 fotos</li>
                    <li>✅ Destaque nas buscas</li>
                    <li>✅ Badge especial</li>
                    <li>✅ Prioridade</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="text-center space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/anunciar')}
                  variant="outline"
                  className="px-8"
                >
                  🆓 Começar Grátis
                </Button>
                <Button 
                  onClick={() => navigate('/plano')}
                  className="px-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  🔥 Tornar-se Fogaréu
                </Button>
                <Button 
                  onClick={() => navigate('/gerenciar-pagamento')}
                  variant="secondary"
                  className="px-8"
                >
                  💳 Gerenciar Pagamento
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Já tem uma conta? <span className="text-primary cursor-pointer" onClick={() => navigate('/login')}>Faça login</span> para gerenciar seus anúncios
              </p>
            </div>
          </div>

          {/* Anúncio discreto após planos */}
          <div className="mt-12 max-w-md mx-auto">
            <ChristianAd slot="1234567890" className="rounded-lg border border-border/50" />
          </div>
        </div>
      </section>
      
      {/* Search Section */}
      <section className="py-12 bg-card/30">
        <div className="container mx-auto px-4">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            onSearch={handleSearch}
          />
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Serviços em Destaque</h2>
              <p className="text-muted-foreground">
                Encontre profissionais e estabelecimentos cristãos qualificados em sua região
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  console.log('Botão mapa clicado, showMap atual:', showMap);
                  setShowMap(!showMap);
                  console.log('showMap após clique:', !showMap);
                }}
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
              {console.log('Renderizando mapa com serviços:', filteredServices.length)}
              <MapFilter 
                services={filteredServices}
                onServiceClick={(service) => {
                  console.log('Clique no serviço do mapa:', service.title);
                  navigate(`/anuncio/${service.id}`);
                }}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse">
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
                  onClick={() => navigate(`/anuncio/${service.id}`)}
                />
              ))
            )}
          </div>

          {/* Anúncio discreto após grid de serviços */}
          {filteredServices.length > 6 && (
            <div className="mt-8 max-w-lg mx-auto">
              <ChristianAd slot="0987654321" className="rounded-lg border border-border/50" />
            </div>
          )}

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Nenhum serviço encontrado com os filtros aplicados.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedLocation('all');
                  setFilteredServices(services);
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
