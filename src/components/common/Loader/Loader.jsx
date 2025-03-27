import React from 'react';

/**
 * Loader component for displaying loading states
 * 
 * @param {Object} props - Component props
 * @param {string} props.size - Size of the loader (small, medium, large)
 * @param {string} props.color - Color of the loader (default: currentColor)
 * @param {string} props.className - Additional CSS class names
 * @param {string} props.label - Accessible label for screen readers
 */
const Loader = ({ 
  size = 'medium', 
  color = 'currentColor',
  className = '',
  label = 'Loading...'
}) => {
  return (
    <div 
      className={`loader loader--${size} ${className}`} 
      role="status"
      aria-label={label}
      style={{ '--loader-color': color }}
    >
      <div className="loader__spinner">
        <div className="loader__circle"></div>
        <div className="loader__circle"></div>
        <div className="loader__circle"></div>
      </div>
      <span className="screen-reader-only">{label}</span>
    </div>
  );
};

export default Loader;