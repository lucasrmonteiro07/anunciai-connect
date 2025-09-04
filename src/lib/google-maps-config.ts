// Configuração global do Google Maps
export const GOOGLE_MAPS_CONFIG = {
  // Sua chave de API do Google Maps
  apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY || '',
  
  // Bibliotecas necessárias
  libraries: ['places', 'geometry'] as const,
  
  // Idioma e região
  language: 'pt-BR',
  region: 'BR',
  
  // Configurações padrão do mapa
  defaultMapOptions: {
    zoom: 10,
    center: { lat: -23.5505, lng: -46.6333 }, // São Paulo
    mapTypeId: 'roadmap' as google.maps.MapTypeId,
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    mapTypeControl: true,
    scaleControl: true,
    rotateControl: true,
    clickableIcons: true,
    keyboardShortcuts: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    draggable: true,
    draggableCursor: 'default',
    draggingCursor: 'grab',
    gestureHandling: 'auto',
    styles: [] as google.maps.MapTypeStyle[]
  },
  
  // Configurações de marcador padrão
  defaultMarkerOptions: {
    animation: google.maps.Animation.DROP,
    clickable: true,
    cursor: 'pointer',
    draggable: false,
    icon: undefined, // Usar ícone padrão
    label: undefined,
    opacity: 1,
    position: { lat: 0, lng: 0 },
    title: '',
    visible: true,
    zIndex: 1
  },
  
  // Configurações de popup padrão
  defaultInfoWindowOptions: {
    maxWidth: 300,
    pixelOffset: new google.maps.Size(0, -30),
    position: { lat: 0, lng: 0 },
    zIndex: 1
  }
};

// Função para validar coordenadas
export const isValidCoordinate = (coord: number, type: 'lat' | 'lng'): boolean => {
  if (isNaN(coord) || coord === null || coord === undefined) return false;
  
  if (type === 'lat') {
    return coord >= -90 && coord <= 90;
  } else {
    return coord >= -180 && coord <= 180;
  }
};

// Função para obter coordenadas válidas
export const getValidCoordinates = (lat: number, lng: number): { lat: number; lng: number } => {
  const validLat = isValidCoordinate(lat, 'lat') ? lat : -23.5505; // São Paulo
  const validLng = isValidCoordinate(lng, 'lng') ? lng : -46.6333; // São Paulo
  
  return { lat: validLat, lng: validLng };
};

// Função para criar marcador customizado
export const createCustomMarker = (
  position: { lat: number; lng: number },
  title: string,
  color: string = '#3b82f6'
): google.maps.Marker => {
  return new google.maps.Marker({
    position,
    title,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10,
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2
    }
  });
};

// Função para criar popup customizado
export const createCustomInfoWindow = (
  content: string,
  position: { lat: number; lng: number }
): google.maps.InfoWindow => {
  return new google.maps.InfoWindow({
    content,
    position,
    ...GOOGLE_MAPS_CONFIG.defaultInfoWindowOptions
  });
};

// Função para carregar a API do Google Maps
export const loadGoogleMapsAPI = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_CONFIG.apiKey}&libraries=${GOOGLE_MAPS_CONFIG.libraries.join(',')}&language=${GOOGLE_MAPS_CONFIG.language}&region=${GOOGLE_MAPS_CONFIG.region}`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Erro ao carregar Google Maps API'));
    
    document.head.appendChild(script);
  });
};

// Função para obter a URL da API
export const getGoogleMapsAPIUrl = (): string => {
  return `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_CONFIG.apiKey}&libraries=${GOOGLE_MAPS_CONFIG.libraries.join(',')}&language=${GOOGLE_MAPS_CONFIG.language}&region=${GOOGLE_MAPS_CONFIG.region}`;
};
