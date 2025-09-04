import React, { useEffect, useRef, useState } from 'react';
import { 
  GOOGLE_MAPS_CONFIG, 
  getValidCoordinates, 
  isValidCoordinate,
  loadGoogleMapsAPI,
  createCustomMarker,
  createCustomInfoWindow
} from '@/lib/google-maps-config';
import { ServiceData } from './service-card';
import './google-maps-styles.css';

interface GoogleMapsFilterProps {
  services: ServiceData[];
  onServiceSelect: (service: ServiceData) => void;
  selectedService?: ServiceData | null;
  height?: string;
  mapType?: google.maps.MapTypeId;
}

const GoogleMapsFilter: React.FC<GoogleMapsFilterProps> = ({
  services,
  onServiceSelect,
  selectedService,
  height = '400px',
  mapType = google.maps.MapTypeId.ROADMAP
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markers = useRef<google.maps.Marker[]>([]);
  const infoWindows = useRef<google.maps.InfoWindow[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtrar serviços com coordenadas válidas
  const validServices = services.filter(service => 
    service.latitude && 
    service.longitude && 
    isValidCoordinate(service.latitude, 'lat') && 
    isValidCoordinate(service.longitude, 'lng')
  );

  // Calcular centro do mapa baseado nos serviços
  const getMapCenter = (): { lat: number; lng: number } => {
    if (validServices.length === 0) {
      return GOOGLE_MAPS_CONFIG.defaultMapOptions.center;
    }

    const lngs = validServices.map(s => s.longitude!);
    const lats = validServices.map(s => s.latitude!);
    
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    
    return { lat: centerLat, lng: centerLng };
  };

  // Calcular zoom baseado na distribuição dos serviços
  const getMapZoom = (): number => {
    if (validServices.length <= 1) return 12;
    if (validServices.length <= 5) return 10;
    return 8;
  };

  useEffect(() => {
    if (!mapRef.current || map.current) return;

    const initializeMap = async () => {
      try {
        // Carregar a API do Google Maps
        await loadGoogleMapsAPI();

        if (!window.google || !window.google.maps) {
          throw new Error('Google Maps API não carregada');
        }

        const center = getMapCenter();
        const zoom = getMapZoom();

        // Criar o mapa
        map.current = new google.maps.Map(mapRef.current!, {
          ...GOOGLE_MAPS_CONFIG.defaultMapOptions,
          center,
          zoom,
          mapTypeId: mapType
        });

        setIsLoaded(true);
        setError(null);
        addMarkers();

      } catch (err) {
        console.error('Erro ao inicializar Google Maps:', err);
        setError('Erro ao carregar o mapa');
      }
    };

    initializeMap();

    // Cleanup
    return () => {
      clearMarkers();
      if (map.current) {
        map.current = null;
      }
    };
  }, [mapType]);

  // Adicionar marcadores
  const addMarkers = () => {
    if (!map.current) return;

    clearMarkers();

    validServices.forEach((service, index) => {
      const validCoords = getValidCoordinates(service.latitude!, service.longitude!);
      
      // Criar marcador
      const marker = createCustomMarker(
        validCoords,
        service.title,
        selectedService?.id === service.id ? '#ef4444' : '#3b82f6'
      );

      // Adicionar ao mapa
      marker.setMap(map.current);

      // Criar popup
      const popupContent = `
        <div class="p-2 min-w-[200px]">
          <div class="flex items-start gap-3">
            <img 
              src="${service.image || '/placeholder.svg'}" 
              alt="${service.title}"
              class="w-12 h-12 rounded-lg object-cover"
              onerror="this.src='/placeholder.svg'"
            />
            <div class="flex-1">
              <h3 class="font-semibold text-sm text-gray-900">${service.title}</h3>
              <p class="text-xs text-gray-600 mt-1">${service.category}</p>
              ${service.address ? `<p class="text-xs text-gray-500 mt-1">${service.address}</p>` : ''}
              <div class="flex items-center justify-between mt-2">
                <span class="text-sm font-bold text-green-600">R$ ${service.price?.toFixed(2) || '0,00'}</span>
                <button 
                  onclick="window.selectService(${service.id})"
                  class="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  Ver Detalhes
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      const infoWindow = createCustomInfoWindow(popupContent, validCoords);

      // Adicionar evento de clique no marcador
      marker.addListener('click', () => {
        // Fechar outros popups
        infoWindows.current.forEach(iw => iw.close());
        
        // Abrir popup atual
        infoWindow.open(map.current, marker);
        
        // Selecionar serviço
        onServiceSelect(service);
      });

      markers.current.push(marker);
      infoWindows.current.push(infoWindow);
    });

    // Adicionar função global para seleção de serviço
    (window as any).selectService = (serviceId: number) => {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        onServiceSelect(service);
      }
    };
  };

  // Limpar marcadores
  const clearMarkers = () => {
    markers.current.forEach(marker => marker.setMap(null));
    infoWindows.current.forEach(infoWindow => infoWindow.close());
    markers.current = [];
    infoWindows.current = [];
  };

  // Atualizar marcadores quando serviços mudarem
  useEffect(() => {
    if (isLoaded && map.current) {
      addMarkers();
    }
  }, [services, selectedService, isLoaded]);

  // Loading state
  if (typeof window === 'undefined') {
    return (
      <div 
        className="w-full rounded-lg overflow-hidden border border-border flex items-center justify-center bg-gray-100 google-maps-loading google-maps-container"
        className="google-maps-container"
        style={{ height }}
      >
        <p className="text-muted-foreground">Carregando mapa...</p>
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
      {/* Contador de serviços */}
      <div className="absolute top-2 left-2 z-10 bg-white bg-opacity-90 px-2 py-1 rounded text-xs shadow-sm">
        {validServices.length} serviço{validServices.length !== 1 ? 's' : ''} encontrado{validServices.length !== 1 ? 's' : ''}
      </div>
      
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

export default GoogleMapsFilter;
