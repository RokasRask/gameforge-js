import React from 'react';

/**
 * Button component with 8-bit styling
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant (primary, secondary, success, danger)
 * @param {string} props.size - Button size (small, medium, large)
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {Function} props.onClick - Click handler function
 * @param {string} props.className - Additional CSS class names
 * @param {React.ReactNode} props.children - Button content
 */
const Button = ({ 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  className = '',
  children,
  ...props
}) => {
  // Event handler with sound effect
  const handleClick = (e) => {
    // TODO: Add 8-bit sound effect on click
    if (onClick) onClick(e);
  };

  return (
    <button
      className={`pixel-button pixel-button--${variant} pixel-button--${size} ${className}`}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      <span className="pixel-button__content">{children}</span>
      <div className="pixel-button__shadow"></div>
    </button>
  );
};

export default Button;