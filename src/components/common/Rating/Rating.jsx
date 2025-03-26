import React from 'react';

/**
 * Star rating component with 8-bit styling
 * 
 * @param {Object} props - Component props
 * @param {number} props.value - Rating value (0-5)
 * @param {number} props.max - Maximum rating value (default: 5)
 * @param {boolean} props.readonly - Whether the rating can be changed (default: true)
 * @param {string} props.size - Size variant (small, medium, large)
 * @param {Function} props.onChange - Callback when rating changes
 * @param {string} props.className - Additional CSS class names
 */
const Rating = ({ 
  value = 0, 
  max = 5, 
  readonly = true, 
  size = 'medium',
  onChange,
  className = ''
}) => {
  // Normalize value
  const normalizedValue = Math.max(0, Math.min(value, max));
  
  // Generate stars array
  const stars = Array.from({ length: max }, (_, index) => {
    // Calculate fill percentage for this star
    const fillPercent = Math.max(0, Math.min(100, (normalizedValue - index) * 100));
    
    return (
      <div 
        key={index}
        className={`rating__star rating__star--${size} ${fillPercent > 0 ? 'is-active' : ''}`}
        onClick={readonly ? undefined : () => onChange && onChange(index + 1)}
        role={readonly ? undefined : 'button'}
        aria-label={readonly ? undefined : `Rate ${index + 1} out of ${max}`}
      >
        <div className="rating__star-fill" style={{ width: `${fillPercent}%` }}></div>
      </div>
    );
  });
  
  return (
    <div className={`rating rating--${size} ${!readonly ? 'is-interactive' : ''} ${className}`}>
      {stars}
    </div>
  );
};

export default Rating;