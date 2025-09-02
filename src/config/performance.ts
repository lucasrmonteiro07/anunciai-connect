// Configurações de performance para a aplicação

export const PERFORMANCE_CONFIG = {
  // Cache durations
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutos
  GC_TIME: 10 * 60 * 1000, // 10 minutos
  
  // Retry settings
  MAX_RETRIES: 1,
  RETRY_DELAY: 1000,
  
  // Image optimization
  IMAGE_QUALITY: 80,
  IMAGE_WIDTHS: [320, 640, 768, 1024, 1280, 1536],
  
  // Lazy loading
  LAZY_LOAD_THRESHOLD: 100, // pixels
  
  // Bundle optimization
  CHUNK_SIZE_WARNING: 1000, // KB
};

export const getOptimizedImageUrl = (url: string, width?: number, quality?: number): string => {
  if (url.includes('unsplash.com')) {
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (quality) params.set('q', quality.toString());
    else params.set('q', PERFORMANCE_CONFIG.IMAGE_QUALITY.toString());
    
    return `${url}&${params.toString()}`;
  }
  
  return url;
};

export const preloadCriticalResources = () => {
  // Preload fontes críticas
  const criticalFonts = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  ];
  
  criticalFonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = font;
    document.head.appendChild(link);
  });
};
