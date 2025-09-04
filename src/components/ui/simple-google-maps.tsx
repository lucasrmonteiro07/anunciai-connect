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

  // Função para obter a classe CSS baseada na altura
  const getHeightClass = (height: string) => {
    const heightValue = parseInt(height.replace('px', ''));
    if (heightValue <= 200) return 'h-200';
    if (heightValue <= 250) return 'h-250';
    if (heightValue <= 300) return 'h-300';
    if (heightValue <= 350) return 'h-350';
    if (heightValue <= 400) return 'h-400';
    if (heightValue <= 450) return 'h-450';
    return 'h-500';
  };

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
        className={`w-full google-maps-container ${getHeightClass(height)}`}
      />
    </div>
  );
};

export default SimpleGoogleMaps;
