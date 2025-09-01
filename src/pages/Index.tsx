import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/header';
import HeroSection from '@/components/ui/hero-section';
import SearchBar from '@/components/ui/search-bar';
import ServiceCard, { ServiceData } from '@/components/ui/service-card';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import SEO from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Mock data as fallback
const mockServices: ServiceData[] = [
  {
    id: '1',
    title: 'Construções Silva & Filhos',
    description: 'Empresa familiar especializada em construção residencial e comercial. Mais de 15 anos de experiência no mercado com foco em qualidade e atendimento cristão.',
    category: 'Construção',
    type: 'empreendimento',
    location: { city: 'São Paulo', uf: 'SP' },
    contact: { phone: '(11) 99999-9999', email: 'contato@silvafilhos.com.br' },
    logo: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
    images: [],
    isVip: true,
    denomination: 'Igreja Batista',
    ownerName: 'João Silva'
  },
  {
    id: '2', 
    title: 'Ministério de Louvor & Eventos',
    description: 'Serviços de sonorização, música ao vivo e organização de eventos cristãos. Especialistas em casamentos, congressos e celebrações.',
    category: 'Música',
    type: 'prestador',
    location: { city: 'Rio de Janeiro', uf: 'RJ' },
    contact: { phone: '(21) 88888-8888', email: 'louvor@eventos.com.br' },
    logo: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    images: [],
    isVip: false,
    denomination: 'Lagoinha',
    ownerName: 'Maria Santos'
  },
  {
    id: '3',
    title: 'Buffet Maná - Catering Cristão',
    description: 'Buffet especializado em eventos cristãos, casamentos e confraternizações. Cardápio variado com opções tradicionais e contemporâneas.',
    category: 'Alimentação',
    type: 'empreendimento',
    location: { city: 'Belo Horizonte', uf: 'MG' },
    contact: { phone: '(31) 77777-7777', email: 'contato@buffetmana.com.br' },
    logo: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=300&fit=crop',
    images: [],
    isVip: true,
    denomination: 'Assembleia de Deus',
    ownerName: 'Pedro Oliveira'
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [filteredServices, setFilteredServices] = useState<ServiceData[]>([]);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [services, searchTerm, selectedCategory, selectedLocation]);

  const loadServices = async () => {
    try {
      // Use the secure services_public view that excludes sensitive contact information
      const { data, error } = await supabase
        .from('services_public')
        .select('*')
        .order('is_vip', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching services:', error);
        // Use mock data as fallback
        setServices(mockServices);
        setFilteredServices(mockServices);
        return;
      }

      // Transform Supabase data to ServiceData format  
      // Note: Using services_public view which excludes sensitive contact information for security
      const transformedServices: ServiceData[] = (data || []).map(service => ({
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
          // address is not available in public view for privacy
          address: undefined
        },
        contact: { 
          // Contact info is not available in public view for privacy protection
          phone: '', 
          email: '',
          whatsapp: undefined
        },
        logo: service.logo_url || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
        images: service.images || [],
        isVip: service.is_vip,
        denomination: service.denomination || '',
        // owner_name is not available in public view for privacy
        ownerName: '',
        socialMedia: {
          instagram: service.instagram || undefined,
          facebook: service.facebook || undefined,
          website: service.website || undefined
        }
      }));

      // Combine real data with mock data for demonstration
      const allServices = [...transformedServices, ...mockServices];
      setServices(allServices);
      setFilteredServices(allServices);
    } catch (error) {
      console.error('Error loading services:', error);
      setServices(mockServices);
      setFilteredServices(mockServices);
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
        description="Encontre prestadores cristãos qualificados e empreendimentos com destaque VIP. Busca por categoria e localização."
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
            {/* Free Plan */}
            <div className="bg-card rounded-xl p-8 border-2 border-border hover:border-primary/50 transition-colors">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Anúncio Gratuito</h3>
                <p className="text-4xl font-bold text-primary mb-4">R$ 0</p>
                <p className="text-muted-foreground mb-6">Para sempre</p>
                <ul className="text-left space-y-3 mb-8">
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
                </ul>
                <Button className="w-full" onClick={() => navigate('/anunciar')}>
                  Começar Grátis
                </Button>
              </div>
            </div>

            {/* VIP Plan */}
            <div className="bg-gradient-to-br from-primary to-primary-foreground rounded-xl p-8 border-2 border-primary relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
                Destaque
              </div>
              <div className="text-center text-white">
                <h3 className="text-2xl font-bold mb-2">Seja VIP</h3>
                <div className="mb-4">
                  <p className="text-3xl font-bold">R$ 14,90</p>
                  <p className="text-sm opacity-90">por mês</p>
                  <p className="text-lg mt-2">ou R$ 11,90/mês no plano anual</p>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Destaque na busca
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Badge VIP especial
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Múltiplas fotos
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Aparece primeiro
                  </li>
                </ul>
                <div className="space-y-2">
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    onClick={() => navigate('/vip')}
                  >
                    Tornar-se VIP
                  </Button>
                </div>
              </div>
            </div>
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
                Encontre profissionais cristãos qualificados em sua região
              </p>
            </div>
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>

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

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center space-y-2">
          <p className="text-muted-foreground">
            © 2025 Anunciai.app.br - Conectando a comunidade Cristã
          </p>
          <p className="text-sm text-muted-foreground">
            Feito por <span className="font-semibold">AURORA BUSINESS INTELLIGENCE</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
