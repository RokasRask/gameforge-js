import React, { createContext, useState, useEffect } from 'react';

// Create context with default value
export const ThemeContext = createContext({
  theme: 'default',
  setTheme: () => {},
});

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('default');

  // Load theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Update body class and localStorage when theme changes
  useEffect(() => {
    document.body.className = theme !== 'default' ? `theme-${theme}` : '';
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Context value
  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;