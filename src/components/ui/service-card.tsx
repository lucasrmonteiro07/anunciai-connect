import React from 'react';
import { MapPin, Star, Crown, Phone, Mail } from 'lucide-react';
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
          <Badge className="bg-gradient-to-r from-vip to-vip-glow text-black font-semibold flex items-center gap-1">
            <Crown className="h-3 w-3" />
            VIP
          </Badge>
        </div>
      )}
      
      <CardContent className="p-0">
        {/* Logo/Image Section */}
        <div className="relative h-48 bg-muted rounded-t-lg overflow-hidden">
          <img 
            src={service.logo} 
            alt={`Logo ${service.title}`}
            className="w-full h-full object-cover"
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
              <div className="flex items-center justify-center text-xs text-vip font-medium">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Anúncio Premium
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;