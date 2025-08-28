'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseLazyLoadingOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useLazyLoading(options: UseLazyLoadingOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true
  } = options;

  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const observe = useCallback(() => {
    if (!elementRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            observerRef.current?.disconnect();
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observerRef.current.observe(elementRef.current);
  }, [threshold, rootMargin, triggerOnce]);

  useEffect(() => {
    observe();
    return () => observerRef.current?.disconnect();
  }, [observe]);

  const markAsLoaded = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return {
    elementRef,
    isInView,
    isLoaded,
    markAsLoaded
  };
}

// 图像懒加载Hook
export function useImageLazyLoading(src: string, options?: UseLazyLoadingOptions) {
  const { elementRef, isInView, isLoaded, markAsLoaded } = useLazyLoading(options);
  const [imageSrc, setImageSrc] = useState<string | undefined>();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isInView && src && !imageSrc) {
      setImageSrc(src);
    }
  }, [isInView, src, imageSrc]);

  const handleLoad = useCallback(() => {
    markAsLoaded();
  }, [markAsLoaded]);

  const handleError = useCallback(() => {
    setError(true);
  }, []);

  return {
    elementRef,
    imageSrc,
    isLoaded,
    error,
    handleLoad,
    handleError
  };
}

// 组件懒加载Hook
export function useComponentLazyLoading<T>(
  loadComponent: () => Promise<T>,
  options?: UseLazyLoadingOptions
) {
  const { elementRef, isInView } = useLazyLoading(options);
  const [component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (isInView && !component && !loading) {
      setLoading(true);
      loadComponent()
        .then(setComponent)
        .catch(setError)
        .finally(() => setLoading(false));
    }
  }, [isInView, component, loading, loadComponent]);

  return {
    elementRef,
    component,
    loading,
    error
  };
}

// 预加载Hook
export function usePreload() {
  const preloadedResources = useRef(new Set<string>());

  const preloadImage = useCallback((src: string) => {
    if (preloadedResources.current.has(src)) return;

    const img = new Image();
    img.src = src;
    preloadedResources.current.add(src);
  }, []);

  const preloadImages = useCallback((srcs: string[]) => {
    srcs.forEach(preloadImage);
  }, [preloadImage]);

  const preloadComponent = useCallback(async (loadComponent: () => Promise<any>) => {
    try {
      await loadComponent();
    } catch (error) {
      console.warn('Failed to preload component:', error);
    }
  }, []);

  return {
    preloadImage,
    preloadImages,
    preloadComponent
  };
}