import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
    console.log('Setting map center to:', { lat, lng });
    map.setView([lat, lng], 15);
    // Disable any automatic location detection
    map.off('locationfound');
    map.off('locationerror');
  }, [map, lat, lng]);

  return null;
};

const MiniMap: React.FC<MiniMapProps> = ({ latitude, longitude, title, address }) => {
  console.log('MiniMap props:', { latitude, longitude, title, address });
  
  // Ensure coordinates are valid numbers
  const validLat = isNaN(latitude) ? -14.2350 : latitude;
  const validLng = isNaN(longitude) ? -51.9253 : longitude;
  
  return (
    <div className="w-full h-48 rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={[validLat, validLng]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={false}
        attributionControl={false}
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
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MiniMap;