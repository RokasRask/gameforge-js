import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { SoundProvider } from './contexts/SoundContext';
import { AuthProvider } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';

// Layout
import MainLayout from './layouts/MainLayout/MainLayout';

// Pages
import LandingPage from './pages/LandingPage/LandingPage';
import GamesPage from './pages/GamesPage/GamesPage';
import GameCategoryPage from './pages/GameCategoryPage/GameCategoryPage';
import GameDetailPage from './pages/GameDetailPage/GameDetailPage';
import ContactPage from './pages/ContactPage/ContactPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import LeaderboardPage from './pages/LeaderboardPage/LeaderboardPage';
import DeveloperPortalPage from './pages/DeveloperPortalPage/DeveloperPortalPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

/**
 * Main App component
 */
const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading state
  useEffect(() => {
    // This would be used for initial data fetching, theme loading, etc.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="app-loader">
        <div className="app-loader__content">
          <div className="app-loader__logo">GameForge.js</div>
          <div className="app-loader__spinner"></div>
          <p className="app-loader__text">Loading awesome games...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ThemeProvider>
        <SoundProvider>
          <AuthProvider>
            <GameProvider>
              <div className="app">
                <Routes>
                  {/* Wrapped in MainLayout */}
                  <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
                  <Route path="/games" element={<MainLayout><GamesPage /></MainLayout>} />
                  <Route path="/games/:id" element={<MainLayout><GameDetailPage /></MainLayout>} />
                  <Route path="/categories/:category" element={<MainLayout><GameCategoryPage /></MainLayout>} />
                  <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
                  <Route path="/leaderboard" element={<MainLayout><LeaderboardPage /></MainLayout>} />
                  <Route path="/developer-portal" element={<MainLayout><DeveloperPortalPage /></MainLayout>} />
                  
                  {/* Auth pages */}
                  <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
                  <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} />
                  <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
                  
                  {/* 404 page */}
                  <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
                </Routes>
              </div>
            </GameProvider>
          </AuthProvider>
        </SoundProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;