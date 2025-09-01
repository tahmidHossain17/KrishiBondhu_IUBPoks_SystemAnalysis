// Performance monitoring and optimization utilities

export interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint?: number;
  timeToInteractive?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
}

export class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    // Basic navigation timing
    if (performance.timing) {
      this.collectNavigationTiming();
    }

    // Performance observer for paint timing
    if ('PerformanceObserver' in window) {
      this.observePaintTiming();
      this.observeLCP();
      this.observeFID();
      this.observeCLS();
    }

    // Observe resource loading
    this.observeResourceTiming();
  }

  private collectNavigationTiming() {
    const timing = performance.timing;
    this.metrics.loadTime = timing.loadEventEnd - timing.navigationStart;
    this.metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
  }

  private observePaintTiming() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-paint') {
            this.metrics.firstPaint = entry.startTime;
          }
          if (entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = entry.startTime;
          }
        }
      });
      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('Paint timing not supported:', error);
    }
  }

  private observeLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.metrics.largestContentfulPaint = lastEntry.startTime;
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('LCP not supported:', error);
    }
  }

  private observeFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.firstInputDelay = (entry as any).processingStart - entry.startTime;
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('FID not supported:', error);
    }
  }

  private observeCLS() {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            this.metrics.cumulativeLayoutShift = clsValue;
          }
        }
      });
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('CLS not supported:', error);
    }
  }

  private observeResourceTiming() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resource = entry as PerformanceResourceTiming;
          
          // Log slow resources
          const loadTime = resource.responseEnd - resource.requestStart;
          if (loadTime > 1000) { // Slower than 1 second
            console.warn(`Slow resource: ${resource.name} took ${loadTime.toFixed(2)}ms`);
          }
        }
      });
      observer.observe({ entryTypes: ['resource'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('Resource timing not supported:', error);
    }
  }

  getMetrics(): PerformanceMetrics {
    return this.metrics as PerformanceMetrics;
  }

  logMetrics() {
    console.group('🚀 Performance Metrics');
    console.log('Load Time:', this.metrics.loadTime?.toFixed(2) + 'ms');
    console.log('DOM Content Loaded:', this.metrics.domContentLoaded?.toFixed(2) + 'ms');
    console.log('First Paint:', this.metrics.firstPaint?.toFixed(2) + 'ms');
    console.log('First Contentful Paint:', this.metrics.firstContentfulPaint?.toFixed(2) + 'ms');
    console.log('Largest Contentful Paint:', this.metrics.largestContentfulPaint?.toFixed(2) + 'ms');
    console.log('First Input Delay:', this.metrics.firstInputDelay?.toFixed(2) + 'ms');
    console.log('Cumulative Layout Shift:', this.metrics.cumulativeLayoutShift?.toFixed(4));
    console.groupEnd();
  }

  // Performance scoring based on Google's Core Web Vitals
  getPerformanceScore(): {
    score: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    details: Record<string, any>;
  } {
    const details: Record<string, any> = {};
    let score = 100;

    // LCP scoring (0-40 points)
    if (this.metrics.largestContentfulPaint) {
      const lcp = this.metrics.largestContentfulPaint;
      if (lcp <= 2500) {
        details.lcp = { value: lcp, score: 40, rating: 'good' };
      } else if (lcp <= 4000) {
        details.lcp = { value: lcp, score: 20, rating: 'needs-improvement' };
        score -= 20;
      } else {
        details.lcp = { value: lcp, score: 0, rating: 'poor' };
        score -= 40;
      }
    }

    // FID scoring (0-30 points)
    if (this.metrics.firstInputDelay) {
      const fid = this.metrics.firstInputDelay;
      if (fid <= 100) {
        details.fid = { value: fid, score: 30, rating: 'good' };
      } else if (fid <= 300) {
        details.fid = { value: fid, score: 15, rating: 'needs-improvement' };
        score -= 15;
      } else {
        details.fid = { value: fid, score: 0, rating: 'poor' };
        score -= 30;
      }
    }

    // CLS scoring (0-30 points)
    if (this.metrics.cumulativeLayoutShift !== undefined) {
      const cls = this.metrics.cumulativeLayoutShift;
      if (cls <= 0.1) {
        details.cls = { value: cls, score: 30, rating: 'good' };
      } else if (cls <= 0.25) {
        details.cls = { value: cls, score: 15, rating: 'needs-improvement' };
        score -= 15;
      } else {
        details.cls = { value: cls, score: 0, rating: 'poor' };
        score -= 30;
      }
    }

    const rating = score >= 90 ? 'good' : score >= 50 ? 'needs-improvement' : 'poor';

    return { score, rating, details };
  }

  // Memory usage monitoring
  getMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        usage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit * 100).toFixed(2) + '%'
      };
    }
    return null;
  }

  // Bundle analysis
  analyzeBundleSize() {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const jsResources = resources.filter(resource => 
      resource.name.includes('.js') && !resource.name.includes('node_modules')
    );

    const totalSize = jsResources.reduce((total, resource) => {
      return total + (resource.transferSize || 0);
    }, 0);

    return {
      totalJSSize: totalSize,
      resourceCount: jsResources.length,
      resources: jsResources.map(resource => ({
        name: resource.name.split('/').pop(),
        size: resource.transferSize,
        loadTime: resource.responseEnd - resource.requestStart
      }))
    };
  }

  // Connection information
  getConnectionInfo() {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }
    return null;
  }

  // Cleanup observers
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Auto-log performance metrics in development
if (import.meta.env.DEV) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      performanceMonitor.logMetrics();
      
      const score = performanceMonitor.getPerformanceScore();
      console.log('🎯 Performance Score:', score);
      
      const memory = performanceMonitor.getMemoryUsage();
      if (memory) {
        console.log('💾 Memory Usage:', memory);
      }
      
      const bundle = performanceMonitor.analyzeBundleSize();
      console.log('📦 Bundle Analysis:', bundle);
      
      const connection = performanceMonitor.getConnectionInfo();
      if (connection) {
        console.log('🌐 Connection Info:', connection);
      }
    }, 2000);
  });
}

// Export for use in components
export default performanceMonitor;

// React hook for performance monitoring
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>({} as PerformanceMetrics);

  React.useEffect(() => {
    const updateMetrics = () => {
      setMetrics(performanceMonitor.getMetrics());
    };

    // Update metrics periodically
    const interval = setInterval(updateMetrics, 5000);
    updateMetrics(); // Initial update

    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    metrics,
    getScore: () => performanceMonitor.getPerformanceScore(),
    getMemoryUsage: () => performanceMonitor.getMemoryUsage(),
    getBundleAnalysis: () => performanceMonitor.analyzeBundleSize()
  };
}

// Add React import for the hook
import React from 'react';