import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ServiceData } from './service-card';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom VIP marker icon
const vipIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMzQiIHZpZXdCb3g9IjAgMCAyNCAzNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEuNUMyMCAyIDIwIDEwIDIwIDEyQzIwIDE3IDEyIDMxIDEyIDMxUzQgMTcgNDEyQzQgMTAgNCA4IDEyIDEuNVoiIGZpbGw9IiNGRjYzMzMiIHN0cm9rZT0iI0ZGNEQ0RCIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjUiIGZpbGw9IndoaXRlIi8+Cjx0ZXh0IHg9IjEyIiB5PSIxNSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjgiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjRkY0RDREIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5K5PC90ZXh0Pgo8L3N2Zz4K',
  iconSize: [24, 34],
  iconAnchor: [12, 34],
  popupAnchor: [0, -34],
});

interface MapFilterProps {
  services: ServiceData[];
  onServiceClick: (service: ServiceData) => void;
}

// Component to adjust map view based on markers
const MapBounds: React.FC<{ services: ServiceData[] }> = ({ services }) => {
  const map = useMap();
  
  useEffect(() => {
    if (services.length === 0) return;
    
    const validServices = services.filter(s => 
      s.location.latitude && s.location.longitude &&
      !isNaN(s.location.latitude) && !isNaN(s.location.longitude)
    );
    
    if (validServices.length === 0) {
      // Default to Brazil center if no valid coordinates
      map.setView([-14.2350, -51.9253], 4);
      return;
    }
    
    if (validServices.length === 1) {
      // Single marker - center on it
      const service = validServices[0];
      map.setView([service.location.latitude!, service.location.longitude!], 13);
      return;
    }
    
    // Multiple markers - fit bounds
    const bounds = L.latLngBounds(
      validServices.map(service => [service.location.latitude!, service.location.longitude!])
    );
    map.fitBounds(bounds, { padding: [20, 20] });
    
  }, [map, services]);

  return null;
};

const MapFilter: React.FC<MapFilterProps> = ({ services, onServiceClick }) => {
  console.log('MapFilter services:', services);
  
  const validServices = services.filter(s => 
    s.location.latitude && s.location.longitude &&
    !isNaN(s.location.latitude) && !isNaN(s.location.longitude)
  );
  
  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={[-14.2350, -51.9253]}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <MapBounds services={validServices} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validServices.map((service) => (
          <Marker 
            key={service.id}
            position={[service.location.latitude!, service.location.longitude!]}
            icon={service.isVip ? vipIcon : undefined}
            eventHandlers={{
              click: () => onServiceClick(service)
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
                  📍 {service.location.city}, {service.location.uf}
                </div>
                <button 
                  onClick={() => onServiceClick(service)}
                  className="mt-2 px-3 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90"
                >
                  Ver Detalhes
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapFilter;