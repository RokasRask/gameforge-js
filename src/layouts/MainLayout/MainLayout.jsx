import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/common/Navbar/Navbar';
import Footer from '../../components/common/Footer/Footer';
import Transition from '../../components/common/Transition/Transition';
import SoundToggle from '../../components/common/SoundToggle/SoundToggle';
import ThemeSwitcher from '../../components/common/ThemeSwitcher/ThemeSwitcher';

/**
 * Main layout component that wraps all pages
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 */
const MainLayout = ({ children }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousPathname, setPreviousPathname] = useState('');
  
  // Handle route changes for transitions
  useEffect(() => {
    if (previousPathname && previousPathname !== location.pathname) {
      setIsTransitioning(true);
    }
    setPreviousPathname(location.pathname);
  }, [location.pathname, previousPathname]);
  
  // Complete transition handler
  const handleTransitionComplete = () => {
    setIsTransitioning(false);
  };
  
  return (
    <div className="main-layout">
      {/* Page transition effect */}
      <Transition 
        isActive={isTransitioning} 
        onComplete={handleTransitionComplete}
        type="fade"
        duration={300}
      />
      
      {/* Header and navigation */}
      <header className="main-layout__header">
        <Navbar />
      </header>
      
      {/* Page content */}
      <main className="main-layout__content">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Fixed UI elements */}
      <div className="main-layout__fixed-ui">
        <SoundToggle className="main-layout__sound-toggle" />
        <ThemeSwitcher className="main-layout__theme-switcher" />
      </div>
      
      {/* Easter egg trigger - hidden pixel in corner */}
      <div className="main-layout__easter-egg-trigger"></div>
    </div>
  );
};

export default MainLayout;