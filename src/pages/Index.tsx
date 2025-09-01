import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/header';
import HeroSection from '@/components/ui/hero-section';
import SearchBar from '@/components/ui/search-bar';
import ServiceCard, { ServiceData } from '@/components/ui/service-card';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
// Using placeholder images for demonstration
const constructionLogo = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop';
const musicLogo = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop';
const cateringLogo = 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=300&fit=crop';
import SEO from '@/components/SEO';

// Mock data for demonstration
const mockServices: ServiceData[] = [
  {
    id: '1',
    title: 'Construções Silva & Filhos',
    description: 'Empresa familiar especializada em construção residencial e comercial. Mais de 15 anos de experiência no mercado com foco em qualidade e atendimento cristão.',
    category: 'Construção',
    type: 'empreendimento',
    location: { city: 'São Paulo', uf: 'SP' },
    contact: { phone: '(11) 99999-9999', email: 'contato@silvafilhos.com.br' },
    logo: constructionLogo,
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
    logo: musicLogo,
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
    logo: cateringLogo,
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
  const [filteredServices, setFilteredServices] = useState(mockServices);

  const handleSearch = () => {
    let filtered = mockServices;

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
            {filteredServices.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service}
                onClick={() => navigate(`/anuncio/${service.id}`)}
              />
            ))}
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
                  setFilteredServices(mockServices);
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
