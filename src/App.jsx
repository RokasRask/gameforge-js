import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.scss';

// Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// Pages
import LandingPage from './pages/LandingPage/LandingPage';
import GamesPage from './pages/GamesPage/GamesPage';
import ContactPage from './pages/ContactPage/ContactPage';
import GameDetailsPage from './pages/GameDetailsPage/GameDetailsPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

function App() {
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/games/category/:categoryName" element={<GamesPage />} />
            <Route path="/games/:gameId" element={<GameDetailsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;