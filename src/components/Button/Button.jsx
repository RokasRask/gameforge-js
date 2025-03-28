import React from 'react';
import './Button.scss';

const Button = ({ 
  children, 
  type = 'primary', 
  size = 'medium', 
  onClick, 
  disabled = false,
  className = '',
  fullWidth = false,
  icon = null
}) => {
  return (
    <button 
      className={`game-btn game-btn--${type} game-btn--${size} ${fullWidth ? 'game-btn--full-width' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="game-btn__icon">{icon}</span>}
      <span className="game-btn__text">{children}</span>
      <span className="game-btn__glint"></span>
    </button>
  );
};

export default Button;