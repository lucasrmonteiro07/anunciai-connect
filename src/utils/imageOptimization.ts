// Utilitários para otimização de imagens na Vercel
import React from 'react';

export const optimizeImageUrl = (url: string, width?: number, quality?: number): string => {
  // Se for uma imagem do Unsplash, otimizar
  if (url.includes('unsplash.com')) {
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (quality) params.set('q', quality.toString());
    else params.set('q', '80'); // Qualidade padrão
    
    return `${url}&${params.toString()}`;
  }
  
  // Para outras imagens, retornar como está
  return url;
};

export const getImageSrcSet = (url: string, baseWidth: number = 400): string => {
  const widths = [320, 640, 768, 1024, 1280, 1536];
  
  return widths
    .map(width => `${optimizeImageUrl(url, width)} ${width}w`)
    .join(', ');
};

export const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
};

// Lazy loading para imagens
export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = React.useState(placeholder || '');
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    img.src = src;
  }, [src]);

  return { imageSrc, isLoaded };
};
