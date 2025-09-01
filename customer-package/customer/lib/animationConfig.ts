import { gsap } from 'gsap';

// Performance optimizations for GSAP
export const initializeGSAPOptimizations = () => {
  // Set default ease and duration
  gsap.defaults({
    duration: 0.6,
    ease: "power2.out"
  });

  // Enable 3D transforms for better performance
  gsap.set("*", { force3D: true });

  // Optimize for mobile devices
  if (window.innerWidth < 768) {
    gsap.defaults({
      duration: 0.4, // Faster animations on mobile
      ease: "power1.out"
    });
  }

  // Reduce motion for users who prefer it
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.globalTimeline.timeScale(0.1); // Much faster animations
  }
};

// Animation presets for consistency
export const animationPresets = {
  // Fast animations for UI interactions
  fast: {
    duration: 0.2,
    ease: "power2.out"
  },
  
  // Standard animations for page elements
  standard: {
    duration: 0.6,
    ease: "power2.out"
  },
  
  // Slow animations for hero sections
  slow: {
    duration: 1.2,
    ease: "power3.out"
  },
  
  // Bounce animation
  bounce: {
    duration: 0.8,
    ease: "back.out(1.7)"
  },
  
  // Elastic animation
  elastic: {
    duration: 1,
    ease: "elastic.out(1, 0.3)"
  }
};

// Easing functions
export const easings = {
  smooth: "power2.out",
  snappy: "power3.out",
  elastic: "elastic.out(1, 0.3)",
  bounce: "back.out(1.7)",
  linear: "none"
};

// Performance monitoring
export const performanceMonitor = {
  // Track animation performance
  trackAnimation: (name: string, startTime: number) => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (duration > 16.67) { // Slower than 60fps
      console.warn(`Animation "${name}" took ${duration.toFixed(2)}ms (> 16.67ms)`);
    }
  },
  
  // Check if device supports high-performance animations
  supportsHighPerformance: () => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl && window.innerWidth > 1024 && navigator.hardwareConcurrency > 2;
  }
};

// Batch DOM updates for better performance
export const batchAnimations = (animations: (() => void)[]) => {
  const batch = gsap.timeline();
  
  animations.forEach((animation, index) => {
    batch.add(animation, index * 0.1);
  });
  
  return batch;
};

// Memory cleanup utilities
export const cleanupAnimations = (elements: (Element | string)[]) => {
  elements.forEach(element => {
    gsap.killTweensOf(element);
  });
};

export default {
  initializeGSAPOptimizations,
  animationPresets,
  easings,
  performanceMonitor,
  batchAnimations,
  cleanupAnimations
};