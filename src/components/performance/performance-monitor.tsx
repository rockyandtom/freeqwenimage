'use client';

import React, { useEffect, useRef } from 'react';

interface PerformanceMonitorProps {
  componentName: string;
  onMetrics: (metrics: any) => void;
  children: React.ReactNode;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ componentName, onMetrics, children }) => {
  const mountTime = useRef<number | null>(null);

  useEffect(() => {
    mountTime.current = Date.now();

    return () => {
      if (mountTime.current) {
        const unmountTime = Date.now();
        const renderDuration = unmountTime - mountTime.current;
        onMetrics({ renderDuration });
        console.log(`${componentName} rendered in ${renderDuration}ms`);
      }
    };
  }, [componentName, onMetrics]);

  return <>{children}</>;
};

export default PerformanceMonitor;