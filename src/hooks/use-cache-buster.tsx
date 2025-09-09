import { useEffect, useState } from 'react';
import { CacheManager, shouldForceRefresh, markRefreshTime, getLastRefreshTime } from '@/config/performance';

export const useCacheBuster = () => {
  const [refreshKey, setRefreshKey] = useState<number>(Date.now());

  useEffect(() => {
    const lastRefresh = getLastRefreshTime();
    
    if (shouldForceRefresh(lastRefresh || undefined)) {
      // Clear cache and force refresh
      CacheManager.invalidateCache();
      markRefreshTime();
      setRefreshKey(Date.now());
    }

    // Set up periodic cache cleanup
    const cleanupInterval = setInterval(() => {
      CacheManager.clearExpiredCache();
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(cleanupInterval);
  }, []);

  const forceRefresh = () => {
    CacheManager.invalidateCache();
    markRefreshTime();
    setRefreshKey(Date.now());
    window.location.reload();
  };

  const invalidatePattern = (pattern: string) => {
    CacheManager.invalidateCache(pattern);
    setRefreshKey(Date.now());
  };

  return {
    refreshKey,
    forceRefresh,
    invalidatePattern
  };
};