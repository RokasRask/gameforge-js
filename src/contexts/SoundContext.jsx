import React, { createContext, useState, useEffect } from 'react';

// Create sound context
export const SoundContext = createContext({
  soundEnabled: true,
  toggleSound: () => {},
  playSound: () => {},
});

// Sound provider component
export const SoundProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Load sound preference from localStorage on initial render
  useEffect(() => {
    const savedSoundPreference = localStorage.getItem('soundEnabled');
    if (savedSoundPreference !== null) {
      setSoundEnabled(savedSoundPreference === 'true');
    }
  }, []);
  
  // Save sound preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('soundEnabled', soundEnabled);
  }, [soundEnabled]);
  
  // Toggle sound on/off
  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };
  
  // Play a sound effect if sound is enabled
  const playSound = (soundName) => {
    if (!soundEnabled) return;
    
    // This would be connected to a proper sound system in a full implementation
    console.log(`Playing sound: ${soundName}`);
    
    // Example implementation (commented out)
    // const audio = new Audio(`/assets/sounds/${soundName}.mp3`);
    // audio.play();
  };
  
  // Context value
  const value = {
    soundEnabled,
    toggleSound,
    playSound,
  };
  
  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
};

export default SoundProvider;