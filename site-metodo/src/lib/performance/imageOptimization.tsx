/**
 * Sistema de otimização de imagens
 * Melhora performance através de lazy loading, formatos modernos e compressão
 */

import Image from 'next/image';
import { useState, useCallback, memo } from 'react';

// === CONFIGURAÇÕES DE OTIMIZAÇÃO ===

/**
 * Tamanhos padrão de imagens para diferentes usos
 */
export const IMAGE_SIZES = {
  avatar: {
    small: { width: 32, height: 32 },
    medium: { width: 64, height: 64 },
    large: { width: 128, height: 128 },
  },
  banner: {
    mobile: { width: 375, height: 200 },
    tablet: { width: 768, height: 300 },
    desktop: { width: 1200, height: 400 },
  },
  thumbnail: {
    small: { width: 150, height: 150 },
    medium: { width: 300, height: 300 },
    large: { width: 600, height: 600 },
  },
} as const;

/**
 * Configuração de qualidade por uso
 */
export const IMAGE_QUALITY = {
  avatar: 85,
  banner: 90,
  thumbnail: 80,
  background: 75,
  icon: 95,
} as const;

// === COMPONENTES OTIMIZADOS ===

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

/**
 * Componente de imagem otimizada com lazy loading
 */
export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  width,
  height,
  quality = 85,
  priority = false,
  sizes,
  className,
  style,
  onLoad,
  onError,
  placeholder = 'blur',
  blurDataURL,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);

  // Gerar blur placeholder se não fornecido
  const defaultBlurDataURL = 
    blurDataURL || 
    `data:image/svg+xml;base64,${Buffer.from(
      `<svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg)"/>
      </svg>`
    ).toString('base64')}`;

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 text-gray-500 ${className}`}
        style={{ width, height, ...style }}
      >
        <span className="text-sm">Erro ao carregar imagem</span>
      </div>
    );
  }

  return (
    <div className={`relative ${isLoading ? 'animate-pulse' : ''}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        priority={priority}
        sizes={sizes}
        className={className}
        style={style}
        placeholder={placeholder}
        blurDataURL={defaultBlurDataURL}
        onLoad={handleLoad}
        onError={handleError}
      />
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ width, height }}
        />
      )}
    </div>
  );
});

/**
 * Avatar otimizado com fallback
 */
interface OptimizedAvatarProps {
  src?: string;
  name: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const OptimizedAvatar = memo(function OptimizedAvatar({
  src,
  name,
  size = 'medium',
  className = '',
}: OptimizedAvatarProps) {
  const dimensions = IMAGE_SIZES.avatar[size];
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-blue-500 text-white font-semibold rounded-full ${className}`}
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <span style={{ fontSize: dimensions.width * 0.4 }}>
          {initials}
        </span>
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={`Avatar de ${name}`}
      width={dimensions.width}
      height={dimensions.height}
      quality={IMAGE_QUALITY.avatar}
      className={`rounded-full object-cover ${className}`}
      placeholder="blur"
    />
  );
});

/**
 * Banner responsivo otimizado
 */
interface OptimizedBannerProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

export const OptimizedBanner = memo(function OptimizedBanner({
  src,
  alt,
  priority = false,
  className = '',
}: OptimizedBannerProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={IMAGE_SIZES.banner.desktop.width}
      height={IMAGE_SIZES.banner.desktop.height}
      quality={IMAGE_QUALITY.banner}
      priority={priority}
      sizes="(max-width: 768px) 375px, (max-width: 1200px) 768px, 1200px"
      className={`w-full h-auto object-cover ${className}`}
    />
  );
});

// === UTILITÁRIOS ===

/**
 * Gerar srcSet responsivo para diferentes tamanhos
 */
export function generateResponsiveSizes(
  basePath: string,
  sizes: number[]
): string {
  return sizes
    .map(size => `${basePath}?w=${size} ${size}w`)
    .join(', ');
}

/**
 * Detectar suporte a formatos modernos
 */
export function supportsWebP(): boolean {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  return canvas.toDataURL('image/webp').indexOf('webp') > -1;
}

export function supportsAVIF(): boolean {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  return canvas.toDataURL('image/avif').indexOf('avif') > -1;
}

/**
 * Otimizar URL de imagem baseado no suporte do browser
 */
export function optimizeImageUrl(
  originalUrl: string,
  width?: number,
  height?: number,
  quality?: number
): string {
  const url = new URL(originalUrl, window.location.origin);
  
  // Adicionar parâmetros de otimização
  if (width) url.searchParams.set('w', width.toString());
  if (height) url.searchParams.set('h', height.toString());
  if (quality) url.searchParams.set('q', quality.toString());
  
  // Definir formato baseado no suporte
  if (supportsAVIF()) {
    url.searchParams.set('fm', 'avif');
  } else if (supportsWebP()) {
    url.searchParams.set('fm', 'webp');
  }
  
  return url.toString();
}

/**
 * Preload de imagens críticas
 */
export function preloadCriticalImages(urls: string[]): void {
  if (typeof window === 'undefined') return;
  
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Lazy loading de imagens com Intersection Observer
 */
export function useLazyImageLoading() {
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Começar loading 50px antes
        threshold: 0.1,
      }
    );
    
    observer.observe(node);
    
    return () => observer.disconnect();
  }, []);
  
  return { ref, isIntersecting };
}
