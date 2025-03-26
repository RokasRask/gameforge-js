import React, { useContext } from 'react';
import { SoundContext } from '../../../contexts/SoundContext';

/**
 * Sound toggle button component
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS class names
 */
const SoundToggle = ({ className = '' }) => {
  const { soundEnabled, toggleSound } = useContext(SoundContext);
  
  return (
    <button 
      className={`sound-toggle ${soundEnabled ? 'is-on' : 'is-off'} ${className}`}
      onClick={toggleSound}
      aria-label={soundEnabled ? 'Turn sound off' : 'Turn sound on'}
      title={soundEnabled ? 'Sound On' : 'Sound Off'}
    >
      <div className="sound-toggle__icon">
        {soundEnabled ? (
          <div className="sound-toggle__icon-on">
            <div className="sound-toggle__sound-wave"></div>
            <div className="sound-toggle__sound-wave"></div>
            <div className="sound-toggle__sound-wave"></div>
          </div>
        ) : (
          <div className="sound-toggle__icon-off">
            <div className="sound-toggle__sound-wave sound-toggle__sound-wave--off"></div>
            <div className="sound-toggle__sound-wave sound-toggle__sound-wave--off"></div>
            <div className="sound-toggle__sound-wave sound-toggle__sound-wave--off"></div>
          </div>
        )}
      </div>
      <span className="sound-toggle__label">
        {soundEnabled ? 'ON' : 'OFF'}
      </span>
    </button>
  );
};

export default SoundToggle;