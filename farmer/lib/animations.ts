import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Animation configurations
export const animationConfig = {
  duration: 0.8,
  ease: "power2.out",
  stagger: 0.1,
};

// Fade in animation
export const fadeIn = (element: string | Element, options?: gsap.TweenVars) => {
  return gsap.fromTo(
    element,
    { 
      opacity: 0, 
      y: 30 
    },
    {
      opacity: 1,
      y: 0,
      duration: animationConfig.duration,
      ease: animationConfig.ease,
      ...options,
    }
  );
};

// Fade in up animation
export const fadeInUp = (element: string | Element, options?: gsap.TweenVars) => {
  return gsap.fromTo(
    element,
    { 
      opacity: 0, 
      y: 60 
    },
    {
      opacity: 1,
      y: 0,
      duration: animationConfig.duration,
      ease: animationConfig.ease,
      ...options,
    }
  );
};

// Fade in left animation
export const fadeInLeft = (element: string | Element, options?: gsap.TweenVars) => {
  return gsap.fromTo(
    element,
    { 
      opacity: 0, 
      x: -60 
    },
    {
      opacity: 1,
      x: 0,
      duration: animationConfig.duration,
      ease: animationConfig.ease,
      ...options,
    }
  );
};

// Fade in right animation
export const fadeInRight = (element: string | Element, options?: gsap.TweenVars) => {
  return gsap.fromTo(
    element,
    { 
      opacity: 0, 
      x: 60 
    },
    {
      opacity: 1,
      x: 0,
      duration: animationConfig.duration,
      ease: animationConfig.ease,
      ...options,
    }
  );
};

// Scale animation
export const scaleIn = (element: string | Element, options?: gsap.TweenVars) => {
  return gsap.fromTo(
    element,
    { 
      opacity: 0, 
      scale: 0.8 
    },
    {
      opacity: 1,
      scale: 1,
      duration: animationConfig.duration,
      ease: animationConfig.ease,
      ...options,
    }
  );
};

// Stagger animation for multiple elements
export const staggerFadeIn = (elements: string | Element[], options?: gsap.TweenVars) => {
  return gsap.fromTo(
    elements,
    { 
      opacity: 0, 
      y: 30 
    },
    {
      opacity: 1,
      y: 0,
      duration: animationConfig.duration,
      ease: animationConfig.ease,
      stagger: animationConfig.stagger,
      ...options,
    }
  );
};

// Scroll trigger animation
export const scrollTriggerAnimation = (
  element: string | Element,
  animation: gsap.TweenVars,
  triggerOptions?: ScrollTrigger.Vars
) => {
  return gsap.fromTo(
    element,
    { 
      opacity: 0, 
      y: 50 
    },
    {
      ...animation,
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        ...triggerOptions,
      },
    }
  );
};

// Card hover animation
export const cardHover = (element: string | Element) => {
  const tl = gsap.timeline({ paused: true });
  
  tl.to(element, {
    scale: 1.05,
    y: -10,
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    duration: 0.3,
    ease: "power2.out",
  });

  return tl;
};

// Button hover animation
export const buttonHover = (element: string | Element) => {
  const tl = gsap.timeline({ paused: true });
  
  tl.to(element, {
    scale: 1.05,
    duration: 0.2,
    ease: "power2.out",
  });

  return tl;
};

// Text reveal animation
export const textReveal = (element: string | Element, options?: gsap.TweenVars) => {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 100,
      skewY: 7,
    },
    {
      opacity: 1,
      y: 0,
      skewY: 0,
      duration: 1,
      ease: "power3.out",
      ...options,
    }
  );
};

// Page transition animations
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeInOut" }
};

// Loading animation
export const loadingAnimation = (element: string | Element) => {
  return gsap.to(element, {
    rotation: 360,
    duration: 1,
    ease: "none",
    repeat: -1,
  });
};

// Counter animation
export const counterAnimation = (
  element: string | Element, 
  endValue: number, 
  options?: gsap.TweenVars
) => {
  const obj = { value: 0 };
  
  return gsap.to(obj, {
    value: endValue,
    duration: 2,
    ease: "power2.out",
    onUpdate: () => {
      if (element instanceof Element) {
        element.textContent = Math.round(obj.value).toString();
      }
    },
    ...options,
  });
};

// Parallax effect
export const parallaxEffect = (element: string | Element, speed: number = 0.5) => {
  return gsap.fromTo(
    element,
    { y: 0 },
    {
      y: () => -(window.innerHeight * speed),
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    }
  );
};

export default {
  fadeIn,
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  staggerFadeIn,
  scrollTriggerAnimation,
  cardHover,
  buttonHover,
  textReveal,
  pageTransition,
  loadingAnimation,
  counterAnimation,
  parallaxEffect,
};