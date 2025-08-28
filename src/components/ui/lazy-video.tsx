'use client';

import { useState, useRef, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
  width?: number;
  height?: number;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export default function LazyVideo({
  src,
  poster,
  className,
  width,
  height,
  autoPlay = false,
  loop = false,
  muted = true,
  controls = true,
  onLoad,
  onError
}: LazyVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
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

  const handleLoadedData = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setIsError(true);
    onError?.();
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-hidden rounded-lg", className)}
      style={{ width, height }}
    >
      {!isInView && (
        <div className="w-full h-full">
          <Skeleton className="w-full h-full absolute inset-0" />
          {poster && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          )}
        </div>
      )}
      
      {isInView && !isError && (
        <>
          {!isLoaded && (
            <div className="w-full h-full absolute inset-0 z-10">
              <Skeleton className="w-full h-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            </div>
          )}
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            width={width}
            height={height}
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            controls={controls}
            onLoadedData={handleLoadedData}
            onError={handleError}
            onPlay={handlePlay}
            onPause={handlePause}
            preload="metadata"
          />
          
          {/* 自定义播放按钮覆盖层 */}
          {!autoPlay && !isPlaying && isLoaded && (
            <div 
              className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 hover:bg-black/30 transition-colors"
              onClick={() => videoRef.current?.play()}
            >
              <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors">
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          )}
        </>
      )}
      
      {isError && (
        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
          <div className="text-center">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">视频加载失败</p>
          </div>
        </div>
      )}
    </div>
  );
}