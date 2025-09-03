import L from 'leaflet';

// Global Leaflet icon configuration
export const configureLeafletIcons = () => {
  if (typeof window === 'undefined') return;

  // Create a robust custom icon
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

  // Aggressive icon configuration
  try {
    // Method 1: Set prototype options
    L.Marker.prototype.options.icon = createDefaultIcon();
    
    // Method 2: Override the default icon class
    if (L.Icon.Default) {
      // Delete the problematic _getIconUrl method
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      
      // Set new options
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
    }
    
    // Method 3: Override the createIcon method
    const originalCreateIcon = L.Marker.prototype._initIcon;
    L.Marker.prototype._initIcon = function() {
      try {
        if (!this.options.icon) {
          this.options.icon = createDefaultIcon();
        }
        return originalCreateIcon.call(this);
      } catch (error) {
        // Fallback: create a simple div icon
        this.options.icon = L.divIcon({
          className: 'custom-div-icon',
          html: '<div style="background-color: #3388ff; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 1px rgba(0,0,0,0.3);"></div>',
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        });
        return originalCreateIcon.call(this);
      }
    };
    
  } catch (error) {
    console.warn('Error configuring Leaflet icons:', error);
  }
};

// Auto-configure when module loads
if (typeof window !== 'undefined') {
  configureLeafletIcons();
}
