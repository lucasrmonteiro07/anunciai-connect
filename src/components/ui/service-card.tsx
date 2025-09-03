import React from 'react';
import { MapPin, Star, Crown, Phone, Mail, Flame } from 'lucide-react';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { Button } from './button';

export interface ServiceData {
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
  valor?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
}

interface ServiceCardProps {
  service: ServiceData;
  onClick?: () => void;
}

const ServiceCard = ({ service, onClick }: ServiceCardProps) => {
  const cardClasses = service.isVip 
    ? "vip-glow card-hover cursor-pointer relative overflow-hidden" 
    : "card-hover cursor-pointer bg-card border border-border hover:border-primary/50";

  return (
    <Card className={cardClasses} onClick={onClick}>
      {service.isVip && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold flex items-center gap-1">
            <Flame className="h-3 w-3" />
            FOGARÉU
          </Badge>
        </div>
      )}
      
      <CardContent className="p-0">
        {/* Logo/Image Section */}
        <div className="relative h-48 bg-muted rounded-t-lg overflow-hidden">
          <img 
            src={(() => {
              // Lógica melhorada de fallback para imagens
              const defaultImage = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop';
              
              // 1. Verificar se há imagens válidas
              if (service.images && Array.isArray(service.images) && service.images.length > 0) {
                const firstImage = service.images[0];
                if (firstImage && typeof firstImage === 'string' && firstImage.trim() !== '') {
                  console.log('Usando primeira imagem:', firstImage);
                  return firstImage;
                }
              }
              
              // 2. Verificar se há logo válido
              if (service.logo && typeof service.logo === 'string' && service.logo.trim() !== '' && service.logo !== defaultImage) {
                console.log('Usando logo:', service.logo);
                return service.logo;
              }
              
              // 3. Usar imagem padrão
              console.log('Usando imagem padrão para:', service.title);
              return defaultImage;
            })()} 
            alt={`Capa ${service.title}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              console.log('❌ Erro ao carregar imagem:', target.src);
              console.log('📝 Serviço:', service.title);
              
              // Se falhar, usar imagem padrão
              const defaultImage = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop';
              if (target.src !== defaultImage) {
                console.log('🔄 Tentando imagem padrão...');
                target.src = defaultImage;
              } else {
                console.log('⚠️  Imagem padrão também falhou');
              }
            }}
            onLoad={() => {
              console.log('✅ Imagem carregada com sucesso:', service.title);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Service Type Badge */}
          <div className="absolute bottom-3 left-3">
            <Badge className={`service-badge ${service.type}`}>
              {service.type === 'prestador' ? 'Prestador de Serviço' : 'Empreendimento'}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-1 line-clamp-1">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground">{service.ownerName}</p>
            </div>
          </div>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {service.description}
          </p>

          {/* Category and Location */}
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary" className="text-xs">
              {service.category}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              {service.location.city}, {service.location.uf}
            </div>
          </div>

          {/* Valor do Serviço */}
          {service.valor && (
            <div className="mb-4">
              <div className="bg-primary/10 text-primary px-3 py-2 rounded-lg text-center">
                <span className="font-semibold text-sm">{service.valor}</span>
              </div>
            </div>
          )}

          {/* Denomination */}
          <div className="mb-4">
            <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded">
              {service.denomination}
            </span>
          </div>

          {/* Contact Actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 border-primary/30 hover:border-primary hover:bg-primary/10"
              onClick={(e) => {
                e.stopPropagation();
                window.open(`tel:${service.contact.phone}`, '_self');
              }}
            >
              <Phone className="h-4 w-4 mr-2" />
              Ligar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 border-primary/30 hover:border-primary hover:bg-primary/10"
              onClick={(e) => {
                e.stopPropagation();
                window.open(`mailto:${service.contact.email}`, '_self');
              }}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
          </div>

          {service.isVip && (
            <div className="mt-3 text-center">
              <div className="flex items-center justify-center text-xs text-orange-500 font-medium">
                <Flame className="h-3 w-3 mr-1 fill-current" />
                Anúncio Fogaréu
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;