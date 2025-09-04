import React, { useEffect, useRef } from 'react';

interface SimpleGoogleMapsProps {
  latitude: number;
  longitude: number;
  title: string;
  height?: string;
}

const SimpleGoogleMaps: React.FC<SimpleGoogleMapsProps> = ({ 
  latitude, 
  longitude, 
  title, 
  height = '300px' 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Verificar se a API do Google Maps está disponível
    if (!window.google || !window.google.maps) {
      console.error('Google Maps API não carregada');
      return;
    }

    // Criar o mapa
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: latitude, lng: longitude },
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // Adicionar marcador
    new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: map,
      title: title
    });

  }, [latitude, longitude, title]);

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

export default SimpleGoogleMaps;
