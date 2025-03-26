import React, { useContext, useState, useRef, useEffect } from 'react';
import { ThemeContext } from '../../../contexts/ThemeContext';

/**
 * Theme switcher component to change application theme
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS class names
 */
const ThemeSwitcher = ({ className = '' }) => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Available themes
  const themes = [
    { id: 'default', name: 'Default', icon: '🎮' },
    { id: 'nes', name: 'NES', icon: '🎲' },
    { id: 'gameboy', name: 'GameBoy', icon: '📱' },
    { id: 'arcade', name: 'Arcade', icon: '👾' }
  ];
  
  // Get current theme info
  const currentTheme = themes.find(t => t.id === theme) || themes[0];
  
  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  // Change theme
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div 
      className={`theme-switcher ${isOpen ? 'is-open' : ''} ${className}`}
      ref={dropdownRef}
    >
      <button 
        className="theme-switcher__toggle"
        onClick={toggleDropdown}
        aria-label="Change theme"
        title="Change theme"
      >
        <span className="theme-switcher__current-icon">{currentTheme.icon}</span>
        <span className="theme-switcher__current-name">{currentTheme.name}</span>
      </button>
      
      {isOpen && (
        <div className="theme-switcher__dropdown">
          <div className="theme-switcher__dropdown-inner">
            {themes.map((themeOption) => (
              <button
                key={themeOption.id}
                className={`theme-switcher__option ${themeOption.id === theme ? 'is-active' : ''}`}
                onClick={() => changeTheme(themeOption.id)}
              >
                <span className="theme-switcher__option-icon">{themeOption.icon}</span>
                <span className="theme-switcher__option-name">{themeOption.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;