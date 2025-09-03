import L from 'leaflet';

// Global Leaflet icon configuration
export const configureLeafletIcons = () => {
  if (typeof window === 'undefined') return;

  // Create a robust custom icon
  const createCustomIcon = (color: string = 'blue') => {
    return L.icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  // Fallback to default icons if color markers fail
  const createDefaultIcon = () => {
    return L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  // Set default icons
  try {
    L.Marker.prototype.options.icon = createDefaultIcon();
    
    // Also set the default icon for the class
    if (L.Icon.Default) {
      L.Icon.Default.prototype.options = {
        ...L.Icon.Default.prototype.options,
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      };
    }
  } catch (error) {
    console.warn('Error configuring Leaflet icons:', error);
  }
};

// Auto-configure when module loads
if (typeof window !== 'undefined') {
  configureLeafletIcons();
}
