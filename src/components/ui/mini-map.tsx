import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { configureLeafletIcons } from '@/lib/leaflet-config';

// Configure Leaflet icons
configureLeafletIcons();

interface MiniMapProps {
  latitude: number;
  longitude: number;
  title: string;
  address?: string;
}

// Component to ensure map centers on correct coordinates
const MapCenter: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;
    
    try {
      map.setView([lat, lng], 15);
      
      // Cleanup function to remove event listeners
      return () => {
        if (map && map.off) {
          map.off('locationfound');
          map.off('locationerror');
        }
      };
    } catch (error) {
      console.error('Error setting map center:', error);
    }
  }, [map, lat, lng]);

  return null;
};

const MiniMap: React.FC<MiniMapProps> = ({ latitude, longitude, title, address }) => {
  
  // Ensure coordinates are valid numbers and within reasonable bounds
  const isValidCoordinate = (coord: number) => {
    return !isNaN(coord) && coord !== null && coord !== undefined && 
           coord >= -90 && coord <= 90; // Latitude bounds
  };
  
  const isValidLongitude = (coord: number) => {
    return !isNaN(coord) && coord !== null && coord !== undefined && 
           coord >= -180 && coord <= 180; // Longitude bounds
  };
  
  // Use coordinates if valid, otherwise use a default location in Brazil
  const validLat = isValidCoordinate(latitude) ? latitude : -23.5505; // São Paulo
  const validLng = isValidLongitude(longitude) ? longitude : -46.6333; // São Paulo
  
  // Handle SSR by showing loading state
  if (typeof window === 'undefined') {
    return (
      <div className="w-full h-48 rounded-lg overflow-hidden border border-border flex items-center justify-center">
        <p className="text-muted-foreground">Carregando mapa...</p>
      </div>
    );
  }
  
  // Check if we're using default coordinates
  const usingDefaultCoords = !isValidCoordinate(latitude) || !isValidLongitude(longitude);
  
  return (
    <div className="w-full h-48 rounded-lg overflow-hidden border border-border">
      {usingDefaultCoords && (
        <div className="absolute top-2 left-2 z-[1000] bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
          Localização aproximada
        </div>
      )}
      <MapContainer
        center={[validLat, validLng]}
        zoom={usingDefaultCoords ? 5 : 15}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
        attributionControl={false}
        key={`minimap-${validLat}-${validLng}`} // Force remount when coordinates change
      >
        <MapCenter lat={validLat} lng={validLng} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[validLat, validLng]}>
          <Popup>
            <div className="text-center">
              <strong>{title}</strong>
              {address && <p className="text-sm text-muted-foreground mt-1">{address}</p>}
              {usingDefaultCoords && (
                <p className="text-xs text-yellow-600 mt-1">
                  Localização aproximada - coordenadas precisas não disponíveis
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MiniMap;