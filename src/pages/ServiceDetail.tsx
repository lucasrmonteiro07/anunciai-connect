import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Instagram, Facebook, Globe, Trash2, MapPin, ExternalLink } from "lucide-react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import MiniMap from "@/components/ui/mini-map";
import Chat from "@/components/Chat";
import Rating from "@/components/Rating";
import ContactInfo from "@/components/ui/contact-info";
import FloatingChat from "@/components/ui/floating-chat";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'prestador' | 'empreendimento';
  location: {
    city: string;
    uf: string;
    latitude?: number;
    longitude?: number;
    address?: string;
  };
  contact: {
    phone: string;
    email: string;
    whatsapp?: string;
  };
  logo: string;
  images: string[];
  isVip: boolean;
  denomination: string;
  ownerName: string;
  userId: string;
  valor?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
}

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (id) {
      loadService();
    }
  }, [id, currentUser]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const loadService = async () => {
    try {
      // Primeiro buscar dados públicos do serviço
      const { data: publicData, error: publicError } = await supabase
        .from('services_public')
        .select('*')
        .eq('id', id)
        .single();

      if (publicError) {
        console.error('Error fetching service:', publicError);
        toast.error('Serviço não encontrado');
        navigate('/');
        return;
      }

      if (!publicData) {
        toast.error('Serviço não encontrado');
        navigate('/');
        return;
      }

      // Depois buscar informações de contato de forma segura (apenas para usuários autenticados)
      let contactInfo = null;
      if (currentUser) {
        try {
          const { data: contactData, error: contactError } = await supabase
            .rpc('get_service_contact_info', { service_id: id });
          
          if (!contactError && contactData && contactData.length > 0) {
            contactInfo = contactData[0];
          }
        } catch (error) {
          console.log('Contact info not accessible - user may not have permission');
        }
      }

      const transformedService: Service = {
        id: publicData.id,
        title: publicData.title,
        description: publicData.description || '',
        category: publicData.category,
        type: publicData.type as 'prestador' | 'empreendimento',
        location: {
          city: publicData.city,
          uf: publicData.uf,
          latitude: publicData.latitude ? Number(publicData.latitude) : undefined,
          longitude: publicData.longitude ? Number(publicData.longitude) : undefined,
          address: undefined // Not available in public table
        },
        contact: {
          phone: contactInfo?.phone || '',
          email: contactInfo?.email || '',
          whatsapp: contactInfo?.whatsapp || ''
        },
        logo: publicData.logo_url && publicData.logo_url.trim() !== '' ? publicData.logo_url : 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
        images: (publicData.images && Array.isArray(publicData.images)) 
          ? publicData.images.filter(img => img && typeof img === 'string' && img.trim() !== '')
          : [],
        isVip: publicData.is_vip || false,
        denomination: publicData.denomination || '',
        ownerName: contactInfo?.owner_name || '',
        userId: '', // Será definido depois
        valor: undefined, // Not available in public table
        socialMedia: {
          instagram: publicData.instagram,
          facebook: publicData.facebook,
          website: publicData.website
        }
      };

      setService(transformedService);
      
      // Verificar se é necessário buscar dados completos para o dono
      if (currentUser && contactInfo) {
        // Se conseguiu acessar contact info, pode ser o dono - buscar dados completos
        try {
          const { data: fullData, error: fullError } = await supabase
            .from('services')
            .select('user_id')
            .eq('id', id)
            .single();

          if (!fullError && fullData && currentUser.id === fullData.user_id) {
            setIsOwner(true);
            // Atualizar userId com o real
            setService(prev => prev ? { ...prev, userId: fullData.user_id } : prev);
          } else {
            // Para visitantes, tentar obter user_id do proprietário
            setService(prev => prev ? { ...prev, userId: fullData?.user_id || '' } : prev);
          }
        } catch (error) {
          console.log('Cannot access full service data - not owner');
        }
      }

    } catch (error) {
      console.error('Error loading service:', error);
      toast.error('Erro ao carregar serviço');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!service || !currentUser || !isOwner) return;

    const confirmed = window.confirm('Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita.');
    
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', service.id)
        .eq('user_id', currentUser.id); // Garantir que só o dono pode excluir

      if (error) throw error;

      toast.success('Anúncio excluído com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Erro ao excluir anúncio');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-8 bg-muted rounded w-1/2"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Serviço não encontrado.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${service.title} - Anunciai`}
        description={service.description}
        canonical={`https://anunciai.app.br/anuncio/${id}`}
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          {isOwner && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/editar-anuncio/${service.id}`)}
              >
                Editar Anúncio
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Anúncio
              </Button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    src={(() => {
                      // Lógica melhorada de fallback para imagens
                      const defaultImage = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop';
                      
                      // 1. Verificar se há imagens válidas
                      if (service.images && Array.isArray(service.images) && service.images.length > 0) {
                        const firstImage = service.images[0];
                        if (firstImage && typeof firstImage === 'string' && firstImage.trim() !== '') {
                          return firstImage;
                        }
                      }
                      
                      // 2. Verificar se há logo válido
                      if (service.logo && typeof service.logo === 'string' && service.logo.trim() !== '' && service.logo !== defaultImage) {
                        return service.logo;
                      }
                      
                      // 3. Usar imagem padrão
                      return defaultImage;
                    })()}
                    alt={service.title}
                    className="w-20 h-20 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const defaultImage = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop';
                      console.log('❌ Erro ao carregar imagem na página de detalhes:', target.src);
                      if (target.src !== defaultImage) {
                        target.src = defaultImage;
                      }
                    }}
                    onLoad={() => {
                      console.log('✅ Imagem carregada com sucesso na página de detalhes:', service.title);
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-2xl font-bold">{service.title}</h1>
                      {service.isVip && (
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">DESTAQUE</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{service.ownerName}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">{service.category}</Badge>
                      <Badge variant="outline">{service.denomination}</Badge>
                    </div>
                  </div>
                </div>
                
                <p className="text-foreground leading-relaxed">{service.description}</p>

                {/* Valor do Serviço */}
                {service.valor && (
                  <div className="mt-4">
                    <div className="bg-primary/10 text-primary px-4 py-3 rounded-lg text-center">
                      <span className="font-semibold text-lg">{service.valor}</span>
                    </div>
                  </div>
                )}

                {/* Service Images Gallery */}
                {service.images && service.images.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Fotos</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {service.images.filter(img => img && img.trim() !== '').map((image, index) => (
                        <img 
                          key={index}
                          src={image}
                          alt={`${service.title} - Foto ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => window.open(image, '_blank')}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location & Map */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Localização</h2>
                  {service.location.latitude && service.location.longitude && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const url = `https://www.google.com/maps?q=${service.location.latitude},${service.location.longitude}`;
                        window.open(url, '_blank');
                      }}
                      className="flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4" />
                      Ver no mapa
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <p className="text-muted-foreground mb-4">
                  {service.location.address ? `${service.location.address} - ` : ''}{service.location.city}, {service.location.uf}
                </p>
                {service.location.latitude && service.location.longitude ? (
                  <MiniMap
                    latitude={service.location.latitude}
                    longitude={service.location.longitude}
                    title={service.title}
                    address={service.location.address}
                  />
                ) : (
                  <div className="bg-muted/30 p-6 rounded-lg text-center">
                    <p className="text-muted-foreground mb-3">
                      Localização exata não disponível no mapa
                    </p>
                    <p className="text-sm text-muted-foreground">
                      📍 {service.location.city}, {service.location.uf}
                    </p>
                    <div className="mt-4 text-xs text-muted-foreground">
                      Se você é o proprietário deste anúncio, edite-o para adicionar coordenadas precisas ou permitir localização manual.
                    </div>
                    <div className="mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const searchQuery = encodeURIComponent(`${service.location.city}, ${service.location.uf}`);
                          const url = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
                          window.open(url, '_blank');
                        }}
                        className="flex items-center gap-2 mx-auto"
                      >
                        <MapPin className="h-4 w-4" />
                        Ver {service.location.city} no mapa
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Actions */}
            <Card>
              <CardContent className="p-6">
                <ContactInfo 
                  serviceId={service.id}
                  isOwner={isOwner}
                />
              </CardContent>
            </Card>

            {/* Social Media */}
            {service.socialMedia && (service.socialMedia.instagram || service.socialMedia.facebook || service.socialMedia.website) && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Redes Sociais</h3>
                  <div className="space-y-3">
                    {service.socialMedia.instagram && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => window.open(`https://instagram.com/${service.socialMedia?.instagram?.replace('@', '')}`, '_blank')}
                      >
                        <Instagram className="h-4 w-4 mr-2" />
                        {service.socialMedia.instagram}
                      </Button>
                    )}
                    
                    {service.socialMedia.facebook && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => window.open(`https://facebook.com/${service.socialMedia?.facebook}`, '_blank')}
                      >
                        <Facebook className="h-4 w-4 mr-2" />
                        Facebook
                      </Button>
                    )}
                    
                    {service.socialMedia.website && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => window.open(`https://${service.socialMedia?.website}`, '_blank')}
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

        {/* Rating Section */}
        <div className="mt-8">
          <Rating 
            serviceId={service.id}
            serviceName={service.title}
          />
        </div>
      </main>
      
      {/* Floating Chat - Só aparece se não for o dono e tiver userId válido */}
      {!isOwner && service.userId && service.userId !== service.id && (
        <FloatingChat 
          receiverId={service.userId}
          receiverName={service.ownerName || service.title}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default ServiceDetail;