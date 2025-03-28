import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, HashRouter } from 'react-router-dom';
import './styles/global.scss';

// Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import GameFrame from './components/GameFrame/GameFrame';

// Pages
import LandingPage from './pages/LandingPage/LandingPage';
import GamesPage from './pages/GamesPage/GamesPage';
import ContactPage from './pages/ContactPage/ContactPage';
import GameDetailsPage from './pages/GameDetailsPage/GameDetailsPage';
import GamePlayPage from './pages/GamePlayPage/GamePlayPage';
import AdminPage from './pages/AdminPage/AdminPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import LogoutPage from './pages/LogoutPage/LogoutPage';

// Context Providers
import { Auth } from './contexts/Auth';
import { MessageProvider } from './contexts/MessageContext';

// ScrollToTop component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    // This is more reliable than window.scrollTo
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant" // Use "instant" instead of "smooth" for immediate effect
      });
    }, 0);
  }, [pathname]);

  return null;
};

// App wrapper with Router
function App() {
  // Use HashRouter to prevent 404 issues with GitHub Pages
  // This will work both in development and production
  return (
    <HashRouter>
      <MessageProvider>
        <Auth>
          <AppContent />
        </Auth>
      </MessageProvider>
    </HashRouter>
  );
}

// Main app content
function AppContent() {
  const location = useLocation();

  return (
    <div className="app">
      <ScrollToTop />
      <Navbar currentPath={location.pathname} />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/category/:categoryName" element={<GamesPage />} />
          <Route path="/games/:gameId" element={<GamePlayPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;