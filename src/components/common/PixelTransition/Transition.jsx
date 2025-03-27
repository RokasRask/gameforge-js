import React, { useEffect, useState, useRef } from 'react';

/**
 * Smooth transition effect between route changes
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isActive - Whether the transition is active
 * @param {string} props.type - Transition effect type (fade, slide, zoom)
 * @param {number} props.duration - Transition duration in milliseconds
 * @param {Function} props.onComplete - Callback function when transition completes
 */
const Transition = ({ 
  isActive = false, 
  type = 'fade', 
  duration = 300, 
  onComplete = () => {} 
}) => {
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState('out');
  const transitionRef = useRef(null);
  
  // Start transition when isActive changes
  useEffect(() => {
    if (isActive) {
      startTransitionOut();
    }
  }, [isActive]);
  
  // Start transition out
  const startTransitionOut = () => {
    setDirection('out');
    setTransitioning(true);
    
    // Switch to transition in after duration/2
    setTimeout(() => {
      setDirection('in');
      
      // Complete transition after another duration/2
      setTimeout(() => {
        setTransitioning(false);
        onComplete();
      }, duration / 2);
      
    }, duration / 2);
  };
  
  if (!isActive && !transitioning) {
    return null;
  }
  
  return (
    <div 
      ref={transitionRef}
      className={`transition transition--${type} transition--${direction} ${transitioning ? 'is-active' : ''}`}
      style={{
        '--transition-duration': `${duration / 2}ms`
      }}
    />
  );
};

export default Transition;