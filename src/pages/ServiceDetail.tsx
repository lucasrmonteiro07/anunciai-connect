import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Mail, MessageCircle, Instagram, Facebook, Globe } from "lucide-react";
import Header from "@/components/ui/header";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import MiniMap from "@/components/ui/mini-map";

// Mock data - replace with real data later
const mockService = {
  id: "1",
  title: "Construções Gospel",
  description: "Especializada em construção e reforma de templos, casas pastorais e centros comunitários cristãos. Mais de 15 anos de experiência servindo igrejas em todo o estado.",
  category: "Construção",
  type: "prestador" as const,
  location: {
    city: "São Paulo",
    uf: "SP", 
    latitude: -23.5505,
    longitude: -46.6333,
    address: "Rua Augusta, 123 - Centro"
  },
  contact: {
    phone: "(11) 99999-9999",
    email: "contato@construcoesgospel.com",
    whatsapp: "5511999999999"
  },
  logo: "/src/assets/construction-logo.jpg",
  images: ["/src/assets/construction-logo.jpg"],
  isVip: true,
  denomination: "Assembleia de Deus",
  ownerName: "João Silva",
  socialMedia: {
    instagram: "@construcoesgospel",
    facebook: "construcoesgospel",
    website: "www.construcoesgospel.com"
  }
};

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Olá! Vi seu anúncio no Anunciai e gostaria de saber mais sobre: ${mockService.title}`);
    window.open(`https://wa.me/${mockService.contact.whatsapp}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${mockService.title} - Anunciai`}
        description={mockService.description}
        canonical={`https://anunciai.app.br/anuncio/${id}`}
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    src={mockService.logo}
                    alt={mockService.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-2xl font-bold">{mockService.title}</h1>
                      {mockService.isVip && (
                        <Badge className="bg-vip text-black">VIP</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{mockService.ownerName}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">{mockService.category}</Badge>
                      <Badge variant="outline">{mockService.denomination}</Badge>
                    </div>
                  </div>
                </div>
                
                <p className="text-foreground leading-relaxed">{mockService.description}</p>
              </CardContent>
            </Card>

            {/* Location & Map */}
            {mockService.location.latitude && mockService.location.longitude && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Localização</h2>
                  <p className="text-muted-foreground mb-4">
                    {mockService.location.address} - {mockService.location.city}, {mockService.location.uf}
                  </p>
                  <MiniMap
                    latitude={mockService.location.latitude}
                    longitude={mockService.location.longitude}
                    title={mockService.title}
                    address={mockService.location.address}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Entre em contato</h3>
                <div className="space-y-3">
                  <Button 
                    onClick={() => window.open(`tel:${mockService.contact.phone}`, '_self')}
                    className="w-full"
                    variant="outline"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {mockService.contact.phone}
                  </Button>
                  
                  {mockService.contact.whatsapp && (
                    <Button 
                      onClick={handleWhatsApp}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  )}
                  
                  <Button 
                    onClick={() => window.open(`mailto:${mockService.contact.email}`, '_self')}
                    className="w-full"
                    variant="outline"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            {mockService.socialMedia && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Redes Sociais</h3>
                  <div className="space-y-3">
                    {mockService.socialMedia.instagram && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => window.open(`https://instagram.com/${mockService.socialMedia?.instagram?.replace('@', '')}`, '_blank')}
                      >
                        <Instagram className="h-4 w-4 mr-2" />
                        {mockService.socialMedia.instagram}
                      </Button>
                    )}
                    
                    {mockService.socialMedia.facebook && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => window.open(`https://facebook.com/${mockService.socialMedia?.facebook}`, '_blank')}
                      >
                        <Facebook className="h-4 w-4 mr-2" />
                        Facebook
                      </Button>
                    )}
                    
                    {mockService.socialMedia.website && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => window.open(`https://${mockService.socialMedia?.website}`, '_blank')}
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        Website
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServiceDetail;