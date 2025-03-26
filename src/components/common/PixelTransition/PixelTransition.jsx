import React, { useEffect, useState, useRef } from 'react';

/**
 * 8-bit pixel transition effect between route changes
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isActive - Whether the transition is active
 * @param {string} props.type - Transition effect type (fade, pixelate, scanline, etc.)
 * @param {number} props.duration - Transition duration in milliseconds
 * @param {Function} props.onComplete - Callback function when transition completes
 */
const PixelTransition = ({ 
  isActive = false, 
  type = 'pixelate', 
  duration = 800, 
  onComplete = () => {} 
}) => {
  const [transitioning, setTransitioning] = useState(false);
  const transitionRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  // Start transition when isActive changes
  useEffect(() => {
    if (isActive) {
      startTransition();
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive]);
  
  // Start transition animation
  const startTransition = () => {
    setTransitioning(true);
    
    // End transition after duration
    setTimeout(() => {
      setTransitioning(false);
      onComplete();
    }, duration);
    
    // Different effects based on type
    switch (type) {
      case 'pixelate':
        pixelateEffect();
        break;
      case 'scanline':
        scanlineEffect();
        break;
      case 'fade':
        // Fade uses CSS transition, no JS animation needed
        break;
      default:
        pixelateEffect();
    }
  };
  
  // Pixelate transition effect
  const pixelateEffect = () => {
    const startTime = Date.now();
    const pixels = 20; // Max pixel size
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Increase pixel size then decrease
      const pixelSize = progress < 0.5
        ? Math.ceil(pixels * (progress * 2))
        : Math.ceil(pixels * (2 - progress * 2));
      
      if (transitionRef.current) {
        transitionRef.current.style.setProperty('--pixel-size', `${pixelSize}px`);
      }
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    
    animate();
  };
  
  // Scanline transition effect
  const scanlineEffect = () => {
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      if (transitionRef.current) {
        transitionRef.current.style.setProperty('--scan-progress', progress.toString());
      }
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    
    animate();
  };
  
  if (!isActive && !transitioning) {
    return null;
  }
  
  return (
    <div 
      ref={transitionRef}
      className={`pixel-transition pixel-transition--${type} ${transitioning ? 'is-active' : ''}`}
      style={{'--transition-duration': `${duration}ms`}}
    ></div>
  );
};

export default PixelTransition;