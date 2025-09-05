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
      lat: s.location?.latitude, 
      lng: s.location?.longitude,
      uf: s.location?.uf,
      hasLat: !!s.location?.latitude,
      hasLng: !!s.location?.longitude,
      latType: typeof s.location?.latitude,
      lngType: typeof s.location?.longitude
    })));

    // Filtrar serviços com coordenadas válidas
    const validServices = services.filter(service => {
      const lat = service.location?.latitude;
      const lng = service.location?.longitude;
      
      const hasLat = lat !== null && lat !== undefined && String(lat) !== '';
      const hasLng = lng !== null && lng !== undefined && String(lng) !== '';
      const isLatNumber = !isNaN(Number(lat));
      const isLngNumber = !isNaN(Number(lng));
      
      console.log(`🗺️ Validação ${service.title}:`, {
        hasLat, hasLng, isLatNumber, isLngNumber,
        lat, lng
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
        center: { lat: Number(service.location!.latitude!), lng: Number(service.location!.longitude!) },
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      // Adicionar marcador
      new google.maps.Marker({
        position: { lat: Number(service.location!.latitude!), lng: Number(service.location!.longitude!) },
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
      const position = { lat: Number(service.location!.latitude!), lng: Number(service.location!.longitude!) };
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
          <div class="google-maps-infowindow">
            <h3>${service.title}</h3>
            <p class="category">${service.category}</p>
            <p class="address">${service.location?.address || 'Endereço não disponível'}</p>
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
      map.current.fitBounds(bounds, 20);
    }

  }, [services]);

  return (
    <div className="w-full rounded-lg overflow-hidden border border-border">
      <div 
        ref={mapRef} 
        className="w-full google-maps-container"
        data-height={height}
      />
    </div>
  );
};

export default ServicesMap;
