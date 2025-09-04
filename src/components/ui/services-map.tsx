import React, { useEffect, useRef } from 'react';
import { ServiceData } from './service-card';

interface ServicesMapProps {
  services: ServiceData[];
  height?: string;
}

const ServicesMap: React.FC<ServicesMapProps> = ({ 
  services, 
  height = '400px' 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markers = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || !window.google || !window.google.maps) return;

    console.log('🗺️ ServicesMap - Serviços recebidos:', services.length);
    console.log('🗺️ ServicesMap - Serviços:', services.map(s => ({ 
      title: s.title, 
      lat: s.latitude, 
      lng: s.longitude,
      uf: s.location?.uf,
      hasLat: !!s.latitude,
      hasLng: !!s.longitude,
      latType: typeof s.latitude,
      lngType: typeof s.longitude
    })));

    // Filtrar serviços com coordenadas válidas
    const validServices = services.filter(service => {
      const hasLat = service.latitude !== null && service.latitude !== undefined && service.latitude !== '';
      const hasLng = service.longitude !== null && service.longitude !== undefined && service.longitude !== '';
      const isLatNumber = !isNaN(Number(service.latitude));
      const isLngNumber = !isNaN(Number(service.longitude));
      
      console.log(`🗺️ Validação ${service.title}:`, {
        hasLat, hasLng, isLatNumber, isLngNumber,
        lat: service.latitude, lng: service.longitude
      });
      
      return hasLat && hasLng && isLatNumber && isLngNumber;
    });

    console.log('🗺️ ServicesMap - Serviços válidos:', validServices.length);

    if (validServices.length === 0) {
      // Se não há serviços válidos, mostrar mapa do Brasil
      map.current = new google.maps.Map(mapRef.current, {
        center: { lat: -14.235, lng: -51.9253 }, // Centro do Brasil
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      return;
    }

    if (validServices.length === 1) {
      // Se há apenas um serviço, centralizar nele
      const service = validServices[0];
      map.current = new google.maps.Map(mapRef.current, {
        center: { lat: service.latitude!, lng: service.longitude! },
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      // Adicionar marcador
      new google.maps.Marker({
        position: { lat: service.latitude!, lng: service.longitude! },
        map: map.current,
        title: service.title
      });
      return;
    }

    // Para múltiplos serviços, calcular bounds
    const bounds = new google.maps.LatLngBounds();
    
    // Limpar marcadores anteriores
    markers.current.forEach(marker => marker.setMap(null));
    markers.current = [];

    // Criar mapa
    map.current = new google.maps.Map(mapRef.current, {
      center: { lat: -29.6833, lng: -51.1306 }, // Novo Hamburgo
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // Adicionar marcadores e calcular bounds
    validServices.forEach(service => {
      const position = { lat: service.latitude!, lng: service.longitude! };
      bounds.extend(position);

      const marker = new google.maps.Marker({
        position,
        map: map.current,
        title: service.title,
        label: service.title.charAt(0).toUpperCase()
      });

      // Adicionar popup
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; min-width: 200px;">
            <h3 style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold;">${service.title}</h3>
            <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">${service.category}</p>
            <p style="margin: 0; font-size: 11px; color: #888;">${service.location?.address || 'Endereço não disponível'}</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map.current, marker);
      });

      markers.current.push(marker);
    });

    // Ajustar zoom para mostrar todos os marcadores
    if (validServices.length > 1) {
      map.current.fitBounds(bounds, { padding: 20 });
    }

  }, [services]);

  return (
    <div className="w-full rounded-lg overflow-hidden border border-border">
      <div 
        ref={mapRef} 
        className="w-full google-maps-container"
        style={{ height }}
      />
    </div>
  );
};

export default ServicesMap;
