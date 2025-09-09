import { addCacheBuster } from '@/config/performance';

// Utility functions for better image handling with cache busting
export const optimizeImageUrl = (url: string | null | undefined): string => {
  if (!url) return '/placeholder.svg';
  
  // Add cache buster to images from Supabase storage
  if (url.includes('supabase.co/storage')) {
    return addCacheBuster(url);
  }
  
  return url;
};

// Force reload images in a container
export const reloadImages = (containerId?: string) => {
  const container = containerId ? document.getElementById(containerId) : document;
  if (!container) return;
  
  const images = container.querySelectorAll('img');
  images.forEach(img => {
    const originalSrc = img.src;
    img.src = '';
    setTimeout(() => {
      img.src = addCacheBuster(originalSrc);
    }, 100);
  });
};

// Check if content is fresh
export const isContentFresh = (timestamp: string | Date, maxAge: number = 5 * 60 * 1000): boolean => {
  const now = Date.now();
  const contentTime = new Date(timestamp).getTime();
  return (now - contentTime) < maxAge;
};

// Generate version-aware URLs
export const versionedUrl = (baseUrl: string, version?: string): string => {
  const v = version || Date.now().toString();
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}v=${v}`;
};