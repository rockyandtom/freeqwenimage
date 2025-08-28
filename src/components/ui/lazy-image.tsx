'use client';

import { useState, useRef, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function LazyImage({
  src,
  alt,
  className,
  width,
  height,
  placeholder,
  onLoad,
  onError
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setIsError(true);
    onError?.();
  };

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      style={{ width, height }}
    >
      {!isInView && (
        <Skeleton className="w-full h-full absolute inset-0" />
      )}
      
      {isInView && !isError && (
        <>
          {!isLoaded && (
            <Skeleton className="w-full h-full absolute inset-0" />
          )}
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            className={cn(
              "transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-0",
              className
            )}
            width={width}
            height={height}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
          />
        </>
      )}
      
      {isError && (
        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
          <div className="text-center">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">图片加载失败</p>
          </div>
        </div>
      )}
      
      {placeholder && !isInView && (
        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
          <span className="text-sm">{placeholder}</span>
        </div>
      )}
    </div>
  );
}