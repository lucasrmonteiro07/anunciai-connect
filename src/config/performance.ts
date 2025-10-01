// Configurações de performance para a aplicação

export const PERFORMANCE_CONFIG = {
  // Cache durations (React Query)
  STALE_TIME: 30 * 1000, // 30 segundos - dados considerados frescos
  CACHE_TIME: 5 * 60 * 1000, // 5 minutos - tempo que dados ficam em cache
  
  // Retry settings
  MAX_RETRIES: 2,
  RETRY_DELAY: 1000,
  
  // Image optimization
  IMAGE_QUALITY: 80,
  IMAGE_WIDTHS: [320, 640, 768, 1024, 1280, 1536],
  
  // Lazy loading
  LAZY_LOAD_THRESHOLD: 100, // pixels
  
  // Bundle optimization
  CHUNK_SIZE_WARNING: 1000, // KB
  
  // Cache control
  REFETCH_INTERVAL: 60 * 1000, // 1 minuto - atualização em background
  REFETCH_ON_WINDOW_FOCUS: true, // Atualizar ao focar janela
};

// Cache management utilities
export class CacheManager {
  private static readonly CACHE_VERSION = 'v1.0.0';
  private static readonly CACHE_PREFIX = 'aurora_cache_';

  static generateCacheKey(key: string): string {
    return `${this.CACHE_PREFIX}${this.CACHE_VERSION}_${key}`;
  }

  static invalidateCache(pattern?: string): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.CACHE_PREFIX)) {
        if (!pattern || key.includes(pattern)) {
          localStorage.removeItem(key);
        }
      }
    });
  }

  static setCacheItem(key: string, data: any, ttl: number = PERFORMANCE_CONFIG.CACHE_TIME): void {
    const cacheKey = this.generateCacheKey(key);
    const item = {
      data,
      timestamp: Date.now(),
      ttl
    };
    localStorage.setItem(cacheKey, JSON.stringify(item));
  }

  static getCacheItem<T>(key: string): T | null {
    const cacheKey = this.generateCacheKey(key);
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return null;
    
    try {
      const item = JSON.parse(cached);
      const now = Date.now();
      
      if (now - item.timestamp > item.ttl) {
        localStorage.removeItem(cacheKey);
        return null;
      }
      
      return item.data;
    } catch {
      localStorage.removeItem(cacheKey);
      return null;
    }
  }

  static clearExpiredCache(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.CACHE_PREFIX)) {
        const cached = localStorage.getItem(key);
        if (cached) {
          try {
            const item = JSON.parse(cached);
            const now = Date.now();
            if (now - item.timestamp > item.ttl) {
              localStorage.removeItem(key);
            }
          } catch {
            localStorage.removeItem(key);
          }
        }
      }
    });
  }
}

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
  
  // Cleanup expired cache on app start
  CacheManager.clearExpiredCache();
};

// Force refresh utilities
export const shouldForceRefresh = (lastRefresh?: number): boolean => {
  if (!lastRefresh) return true;
  
  const now = Date.now();
  const FORCE_REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutos
  return now - lastRefresh > FORCE_REFRESH_INTERVAL;
};

export const markRefreshTime = (): void => {
  localStorage.setItem('last_refresh', Date.now().toString());
};

export const getLastRefreshTime = (): number | null => {
  const lastRefresh = localStorage.getItem('last_refresh');
  return lastRefresh ? parseInt(lastRefresh, 10) : null;
};

// Image optimization with cache busting
export const addCacheBuster = (url: string): string => {
  if (!url) return url;
  
  // Don't add cache buster to external URLs unless it's Supabase storage
  if (!url.includes('supabase.co') && !url.startsWith('/')) {
    return url;
  }
  
  const separator = url.includes('?') ? '&' : '?';
  const timestamp = Math.floor(Date.now() / (1000 * 60 * 10)); // 10 minute intervals
  return `${url}${separator}_t=${timestamp}`;
};
