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
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('status', 'active')
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
          address: service.address || undefined
        },
        contact: { 
          phone: service.phone || '', 
          email: service.email || '',
          whatsapp: service.whatsapp || undefined
        },
        logo: service.logo_url || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
        images: service.images || [],
        isVip: service.is_vip,
        denomination: service.denomination || '',
        ownerName: service.owner_name || '',
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
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 Anunciai.app.br - Conectando a comunidade cristã através de serviços de qualidade
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
