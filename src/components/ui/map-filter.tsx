import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { ServiceData } from './service-card';

// Lazy load do Leaflet
const loadLeaflet = async () => {
  const leafletModule = await import('react-leaflet');
  const { MapContainer, TileLayer, Marker, Popup, useMap } = leafletModule;
  const L = (await import('leaflet')).default;
  
  // Import and configure Leaflet icons
  const { configureLeafletIcons } = await import('@/lib/leaflet-config');
  configureLeafletIcons();
  
  // Additional safety configuration
  const defaultIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  
  L.Marker.prototype.options.icon = defaultIcon;
  
  return { MapContainer, TileLayer, Marker, Popup, useMap, L };
};

interface MapFilterProps {
  services: ServiceData[];
  onServiceClick: (service: ServiceData) => void;
}

// Component to adjust map view based on markers
const MapBounds: React.FC<{ services: ServiceData[]; leafletComponents: any }> = ({ services, leafletComponents }) => {
  const map = leafletComponents.useMap();
  
  useEffect(() => {
    if (!map || services.length === 0) return;
    
    try {
      const validServices = services.filter(s => 
        s.location.latitude && s.location.longitude &&
        !isNaN(s.location.latitude) && !isNaN(s.location.longitude)
      );
      
      if (validServices.length === 0) {
        map.setView([-29.6833, -51.1306], 6); // Novo Hamburgo
        return;
      }
      
      if (validServices.length === 1) {
        const service = validServices[0];
        map.setView([service.location.latitude!, service.location.longitude!], 15);
        return;
      }
      
      // Para múltiplos serviços, ajustar bounds com padding adequado
      const bounds = leafletComponents.L.latLngBounds(
        validServices.map(service => [service.location.latitude!, service.location.longitude!])
      );
      
      // Ajustar bounds com padding maior para melhor visualização
      map.fitBounds(bounds, { 
        padding: [30, 30],
        maxZoom: 15 // Limitar zoom máximo para não ficar muito próximo
      });
    } catch (error) {
      console.error('Error setting map bounds:', error);
    }
  }, [map, services]);

  return null;
};

const MapFilter: React.FC<MapFilterProps> = ({ services, onServiceClick }) => {
  const [leafletComponents, setLeafletComponents] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLeaflet().then(components => {
      setLeafletComponents(components);
      setIsLoading(false);
    });
  }, []);

  // Create VIP icon inside component to avoid module-level side effects
  const vipIcon = useMemo(() => {
    if (typeof window === 'undefined' || !leafletComponents) return undefined;
    
    try {
      return leafletComponents.L.icon({
        iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMzQiIHZpZXdCb3g9IjAgMCAyNCAzNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEuNUMyMCAyIDIwIDEwIDIwIDEyQzIwIDE3IDEyIDMxIDEyIDMxUzQgMTcgNDEyQzQgMTAgNCA4IDEyIDEuNVoiIGZpbGw9IiNGRjYzMzMiIHN0cm9rZT0iI0ZGNEQ0RCIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjUiIGZpbGw9IndoaXRlIi8+Cjx0ZXh0IHg9IjEyIiB5PSIxNSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjgiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjRkY0RDREIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5K5PC90ZXh0Pgo8L3N2Zz4K',
        iconSize: [24, 34],
        iconAnchor: [12, 34],
        popupAnchor: [0, -34],
      });
    } catch (error) {
      console.error('Error creating VIP icon:', error);
      return undefined;
    }
  }, [leafletComponents]);
  
  const validServices = useMemo(() => {
    const valid = services.filter(s => 
      s.location.latitude && s.location.longitude &&
      !isNaN(s.location.latitude) && !isNaN(s.location.longitude)
    );
    
    // Debug: log services data
    console.log('MapFilter - Total services:', services.length);
    console.log('MapFilter - Valid services with coordinates:', valid.length);
    console.log('MapFilter - Services data:', services.map(s => ({
      id: s.id,
      title: s.title,
      lat: s.location.latitude,
      lng: s.location.longitude,
      isVip: s.isVip
    })));
    
    return valid;
  }, [services]);

  const handleServiceClick = useCallback((service: ServiceData) => {
    try {
      onServiceClick(service);
    } catch (error) {
      console.error('Error handling service click:', error);
    }
  }, [onServiceClick]);

  if (typeof window === 'undefined' || isLoading || !leafletComponents) {
    return (
      <div className="w-full h-96 rounded-lg overflow-hidden border border-border flex items-center justify-center">
        <p className="text-muted-foreground">Carregando mapa...</p>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = leafletComponents;
  
  return (
    <div className="w-full h-96 rounded-lg border border-border relative">
      <MapContainer
        center={[-29.6833, -51.1306]} // Centro em Novo Hamburgo
        zoom={validServices.length > 0 ? 12 : 6}
        className="h-full w-full rounded-lg overflow-hidden"
        zoomControl={true}
        scrollWheelZoom={true}
        key={`map-${validServices.length}`} // Force remount when services change significantly
      >
        <MapBounds services={validServices} leafletComponents={leafletComponents} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          maxNativeZoom={18}
          subdomains={['a', 'b', 'c']}
        />
        {validServices.length > 0 ? (
          validServices.map((service) => {
            // Garantir que as coordenadas são válidas
            const lat = Number(service.location.latitude);
            const lng = Number(service.location.longitude);
            
            if (isNaN(lat) || isNaN(lng)) {
              console.warn('Invalid coordinates for service:', service.id, { lat, lng });
              return null;
            }
            
            console.log('Rendering marker for service:', service.title, { lat, lng, isVip: service.isVip });
            
            return (
              <Marker 
                key={`marker-${service.id}`}
                position={[lat, lng]}
                icon={service.isVip && vipIcon ? vipIcon : undefined}
                eventHandlers={{
                  click: () => {
                    console.log('Marker clicked:', service.title);
                    handleServiceClick(service);
                  }
                }}
              >
                <Popup>
                  <div className="text-center min-w-48">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <strong className="text-lg">{service.title}</strong>
                      {service.isVip && <span className="text-orange-500">🔥</span>}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{service.category}</p>
                    <p className="text-sm mb-3">{service.description.substring(0, 100)}...</p>
                    <div className="text-xs text-muted-foreground">
                      📍 {service.location.address ? `${service.location.address} - ` : ''}{service.location.city}, {service.location.uf}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleServiceClick(service);
                      }}
                      className="mt-2 px-3 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })
        ) : (
          // Fallback marker when no services with coordinates
          <Marker 
            key="fallback-marker"
            position={[-29.6833, -51.1306]}
          >
            <Popup>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Nenhum serviço com localização encontrado
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MapFilter;