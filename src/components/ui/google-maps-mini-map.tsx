import React, { useEffect, useRef, useState } from 'react';
import { 
  GOOGLE_MAPS_CONFIG, 
  getValidCoordinates, 
  isValidCoordinate,
  loadGoogleMapsAPI,
  createCustomMarker,
  createCustomInfoWindow
} from '@/lib/google-maps-config';
import './google-maps-styles.css';

interface GoogleMapsMiniMapProps {
  latitude: number;
  longitude: number;
  title: string;
  address?: string;
  height?: string;
  showMarker?: boolean;
  markerColor?: string;
  mapType?: google.maps.MapTypeId;
}

const GoogleMapsMiniMap: React.FC<GoogleMapsMiniMapProps> = ({ 
  latitude, 
  longitude, 
  title, 
  address,
  height = '12rem',
  showMarker = true,
  markerColor = '#3b82f6',
  mapType = google.maps.MapTypeId.ROADMAP
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const marker = useRef<google.maps.Marker | null>(null);
  const infoWindow = useRef<google.maps.InfoWindow | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validar coordenadas
  const isValidLat = isValidCoordinate(latitude, 'lat');
  const isValidLng = isValidCoordinate(longitude, 'lng');
  const validCoords = getValidCoordinates(latitude, longitude);
  const usingDefaultCoords = !isValidLat || !isValidLng;

  useEffect(() => {
    if (!mapRef.current || map.current) return;

    const initializeMap = async () => {
      try {
        // Carregar a API do Google Maps
        await loadGoogleMapsAPI();

        if (!window.google || !window.google.maps) {
          throw new Error('Google Maps API não carregada');
        }

        // Criar o mapa
        map.current = new google.maps.Map(mapRef.current!, {
          ...GOOGLE_MAPS_CONFIG.defaultMapOptions,
          center: validCoords,
          zoom: usingDefaultCoords ? 5 : 15,
          mapTypeId: mapType
        });

        // Adicionar marcador se solicitado
        if (showMarker) {
          marker.current = createCustomMarker(
            validCoords,
            title,
            markerColor
          );

          // Adicionar ao mapa
          marker.current.setMap(map.current);

          // Criar popup
          const popupContent = `
            <div class="p-2 min-w-[200px]">
              <h3 class="font-semibold text-sm text-gray-900">${title}</h3>
              ${address ? `<p class="text-xs text-gray-600 mt-1">${address}</p>` : ''}
              ${usingDefaultCoords ? '<p class="text-xs text-yellow-600 mt-1">Localização aproximada</p>' : ''}
            </div>
          `;

          infoWindow.current = createCustomInfoWindow(popupContent, validCoords);

          // Adicionar evento de clique no marcador
          marker.current.addListener('click', () => {
            if (infoWindow.current && map.current) {
              infoWindow.current.open(map.current, marker.current);
            }
          });
        }

        setIsLoaded(true);
        setError(null);

      } catch (err) {
        console.error('Erro ao inicializar Google Maps:', err);
        setError('Erro ao carregar o mapa');
      }
    };

    initializeMap();

    // Cleanup
    return () => {
      if (marker.current) {
        marker.current.setMap(null);
      }
      if (infoWindow.current) {
        infoWindow.current.close();
      }
      if (map.current) {
        map.current = null;
      }
    };
  }, [validCoords.lat, validCoords.lng, showMarker, markerColor, title, address, usingDefaultCoords, mapType]);

  // Atualizar posição do marcador quando as coordenadas mudarem
  useEffect(() => {
    if (map.current && marker.current) {
      marker.current.setPosition(validCoords);
      map.current.setCenter(validCoords);
    }
  }, [validCoords.lat, validCoords.lng]);

  // Loading state
  if (typeof window === 'undefined') {
    return (
      <div 
        className="w-full rounded-lg overflow-hidden border border-border flex items-center justify-center bg-gray-100 google-maps-loading google-maps-container"
        style={{ height }}
      >
        <p className="text-muted-foreground">Carregando mapa...</p>
      </div>
    );
  }

  // Verificar se a API do Google Maps está disponível
  if (!window.google || !window.google.maps) {
    return (
      <div 
        className="w-full rounded-lg overflow-hidden border border-border flex items-center justify-center bg-yellow-100 google-maps-container"
        style={{ height }}
      >
        <div className="text-center">
          <p className="text-yellow-800 text-sm">Google Maps não carregado</p>
          <p className="text-yellow-600 text-xs mt-1">Verifique sua conexão</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div 
        className="w-full rounded-lg overflow-hidden border border-border flex items-center justify-center bg-red-50 google-maps-error google-maps-container"
        className="google-maps-container"
        style={{ height }}
      >
        <div className="text-center">
          <p className="text-red-600 text-sm">{error}</p>
          <p className="text-red-500 text-xs mt-1">Verifique sua conexão com a internet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-border">
      {/* Aviso de localização aproximada */}
      {usingDefaultCoords && (
        <div className="absolute top-2 left-2 z-10 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs shadow-sm">
          Localização aproximada
        </div>
      )}
      
      {/* Mapa */}
      <div 
        ref={mapRef} 
        className="w-full google-maps-container"
        className="google-maps-container"
        style={{ height }}
      />
      
      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Carregando mapa...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMapsMiniMap;
