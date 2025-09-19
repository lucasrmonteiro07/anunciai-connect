import React, { useState } from 'react';
import { MapPin, Star, Crown, Phone, Mail, Flame, MessageCircle } from 'lucide-react';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { Button } from './button';
import FloatingChat from './floating-chat';
import { optimizeImageUrl } from '@/utils/cacheUtils';

export interface ServiceData {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'prestador' | 'empreendimento';
  product_type?: 'service' | 'product';
  location: {
    city: string;
    uf: string;
    latitude?: number;
    longitude?: number;
    address?: string | null;
  };
  contact: {
    phone: string;
    email: string;
    whatsapp?: string;
  };
  logo: string;
  logo_url?: string;
  images: string[];
  isVip: boolean;
  denomination: string;
  ownerName: string;
  valor?: string;
  price?: number;
  condition?: string;
  brand?: string;
  model?: string;
  warranty_months?: number;
  delivery_available?: boolean;
  stock_quantity?: number;
  userId?: string;
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
  const [showChat, setShowChat] = useState(false);

  const cardClasses = service.isVip 
    ? "vip-glow card-hover cursor-pointer relative overflow-hidden border-2 border-orange-500/50 shadow-lg shadow-orange-500/20" 
    : "card-hover cursor-pointer bg-card border border-border hover:border-primary/50";

  return (
    <Card className={cardClasses} onClick={onClick}>
      {service.isVip && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold flex items-center gap-1 px-3 py-1 text-sm shadow-lg animate-pulse">
            <Flame className="h-4 w-4" />
            FOGARÉU VIP
          </Badge>
        </div>
      )}
      
      <CardContent className="p-0">
        {/* Logo/Image Section */}
        <div className="relative h-48 bg-muted rounded-t-lg overflow-hidden">
          <img 
            src={optimizeImageUrl(
              service.images?.[0] || 
              (service.logo_url && service.logo_url !== 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop' ? service.logo_url : null) || 
              'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop'
            )} 
            alt={`Capa ${service.title}`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop';
            }}
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Photo Gallery Indicator */}
          {service.images && service.images.length > 1 && (
            <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
              +{service.images.length - 1} fotos
            </div>
          )}
          
          {/* Service Type Badge */}
          <div className="absolute bottom-3 left-3">
            <Badge className={`service-badge ${service.type}`}>
              {service.product_type === 'product' ? 'Produto' : 
               service.type === 'prestador' ? 'Prestador de Serviço' : 'Empreendimento'}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-1 line-clamp-1">
                {service.title.toUpperCase()}
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

          {/* Valor do Serviço/Produto */}
          {(service.valor || service.price) && (
            <div className="mb-4">
              <div className="bg-primary/10 text-primary px-3 py-2 rounded-lg text-center">
                <span className="font-semibold text-sm">
                  {service.price ? `R$ ${service.price.toFixed(2)}` : service.valor}
                </span>
              </div>
            </div>
          )}

          {/* Informações do Produto */}
          {service.product_type === 'product' && (
            <div className="mb-4 space-y-2">
              {service.brand && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="font-medium">Marca:</span>
                  <span className="ml-2">{service.brand}</span>
                </div>
              )}
              {service.model && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="font-medium">Modelo:</span>
                  <span className="ml-2">{service.model}</span>
                </div>
              )}
              {service.condition && (
                <div className="flex items-center text-sm">
                  <span className="font-medium">Estado:</span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {service.condition === 'new' ? 'Novo' : 
                     service.condition === 'used' ? 'Usado' : 
                     service.condition === 'refurbished' ? 'Recondicionado' : service.condition}
                  </Badge>
                </div>
              )}
              {service.stock_quantity && service.stock_quantity > 0 && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="font-medium">Estoque:</span>
                  <span className="ml-2">{service.stock_quantity} unidades</span>
                </div>
              )}
              {service.warranty_months && service.warranty_months > 0 && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="font-medium">Garantia:</span>
                  <span className="ml-2">{service.warranty_months} meses</span>
                </div>
              )}
              {service.delivery_available && (
                <div className="flex items-center text-sm text-green-600">
                  <span className="font-medium">✓ Entrega disponível</span>
                </div>
              )}
            </div>
          )}

          {/* Denomination */}
          <div className="mb-4">
            <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded">
              {service.denomination}
            </span>
          </div>

          {/* Contact Actions */}
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-primary/30 hover:border-primary hover:bg-primary/10"
              onClick={(e) => {
                e.stopPropagation();
                // Botão será habilitado quando houver informações de contato disponíveis
                alert('Para ver informações de contato, clique no anúncio para abrir os detalhes completos.');
              }}
              disabled={!service.contact.phone}
              title={service.contact.phone ? `Ligar para ${service.contact.phone}` : 'Informações de contato disponíveis nos detalhes'}
            >
              <Phone className="h-4 w-4 mr-1" />
              Ligar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-primary/30 hover:border-primary hover:bg-primary/10"
              onClick={(e) => {
                e.stopPropagation();
                // Botão será habilitado quando houver informações de contato disponíveis
                alert('Para ver informações de contato, clique no anúncio para abrir os detalhes completos.');
              }}
              disabled={!service.contact.email}
              title={service.contact.email ? `Email para ${service.contact.email}` : 'Informações de contato disponíveis nos detalhes'}
            >
              <Mail className="h-4 w-4 mr-1" />
              Email
            </Button>
            <Button 
              variant={service.isVip ? "default" : "outline"}
              size="sm" 
              className={`${
                service.isVip 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-orange-400/50' 
                  : 'border-primary/30 hover:border-primary hover:bg-primary/10'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setShowChat(true);
              }}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Chat
            </Button>
          </div>

          {service.isVip && (
            <div className="mt-3 text-center">
              <div className="flex items-center justify-center text-sm text-orange-500 font-bold bg-orange-500/10 rounded-lg py-2 px-3">
                <Flame className="h-4 w-4 mr-2 fill-current" />
                Chat Exclusivo VIP Disponível
                <div className="ml-2 w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Floating Chat Component */}
      {showChat && service.userId && (
        <FloatingChat 
          receiverId={service.userId}
          receiverName={service.ownerName || service.title}
          isVip={service.isVip}
        />
      )}
    </Card>
  );
};

export default ServiceCard;