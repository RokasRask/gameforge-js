import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import FeaturedCarousel from '../../components/common/FeaturedCarousel/FeaturedCarousel';

/**
 * Landing page component
 */
const LandingPage = () => {
  // Featured games data (would come from API in production)
  const featuredGames = [
    {
      id: 'game1',
      title: 'Pixel Platformer',
      thumbnail: 'https://via.placeholder.com/400x300/3498db/ffffff?text=Pixel+Platformer',
      description: 'Jump and run through challenging levels in this retro platformer.',
      category: 'Platformer'
    },
    {
      id: 'game2',
      title: 'Space Shooter',
      thumbnail: 'https://via.placeholder.com/400x300/e74c3c/ffffff?text=Space+Shooter',
      description: 'Defend Earth from alien invaders in this classic arcade shooter.',
      category: 'Arcade'
    },
    {
      id: 'game3',
      title: 'Puzzle Quest',
      thumbnail: 'https://via.placeholder.com/400x300/2ecc71/ffffff?text=Puzzle+Quest',
      description: 'Solve mind-bending puzzles in this brain-teasing adventure.',
      category: 'Puzzle'
    }
  ];

  // Game categories
  const categories = [
    { id: 'arcade', name: 'Arcade', icon: '🕹️', count: 12 },
    { id: 'puzzle', name: 'Puzzle', icon: '🧩', count: 8 },
    { id: 'platformer', name: 'Platformer', icon: '👾', count: 5 },
    { id: 'strategy', name: 'Strategy', icon: '♟️', count: 7 },
    { id: 'rpg', name: 'RPG', icon: '⚔️', count: 3 },
    { id: 'sports', name: 'Sports', icon: '🏀', count: 4 }
  ];

  // Play animation when component mounts
  useEffect(() => {
    // Animation code would go here
  }, []);

  return (
    <div className="landing-page">
      {/* Hero section */}
      <section className="hero">
        <div className="hero__container">
          <div className="hero__content">
            <h1 className="hero__title">
              <span className="hero__title-line">Retro Games</span>
              <span className="hero__title-line">Built With</span>
              <span className="hero__title-line hero__title-line--highlight">JavaScript</span>
            </h1>
            <p className="hero__subtitle">
              Play, share, and create 8-bit style games powered by modern web technologies
            </p>
            <div className="hero__buttons">
              <Link to="/games">
                <Button variant="primary" size="large">
                  Browse Games
                </Button>
              </Link>
              <Link to="/developer-portal">
                <Button variant="secondary" size="large">
                  Submit Your Game
                </Button>
              </Link>
            </div>
          </div>
          <div className="hero__visual">
            {/* Animated pixel art visual */}
            <div className="hero__pixel-art"></div>
          </div>
        </div>
      </section>

      {/* Featured games section */}
      <section className="featured">
        <div className="featured__container">
          <h2 className="featured__title">Featured Games</h2>
          <FeaturedCarousel games={featuredGames} />
          <div className="featured__action">
            <Link to="/games">
              <Button variant="secondary">View All Games</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories section */}
      <section className="categories">
        <div className="categories__container">
          <h2 className="categories__title">Game Categories</h2>
          <div className="categories__grid">
            {categories.map(category => (
              <Link 
                key={category.id} 
                to={`/categories/${category.id}`}
                className="category-card"
              >
                <div className="category-card__icon">{category.icon}</div>
                <h3 className="category-card__name">{category.name}</h3>
                <span className="category-card__count">{category.count} games</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="how-it-works">
        <div className="how-it-works__container">
          <h2 className="how-it-works__title">How It Works</h2>
          <div className="how-it-works__steps">
            <div className="step">
              <div className="step__number">1</div>
              <h3 className="step__title">Browse Games</h3>
              <p className="step__description">
                Explore our collection of retro-style games built with JavaScript and React
              </p>
            </div>
            <div className="step">
              <div className="step__number">2</div>
              <h3 className="step__title">Play Online</h3>
              <p className="step__description">
                Play directly in your browser, no downloads required, even offline
              </p>
            </div>
            <div className="step">
              <div className="step__number">3</div>
              <h3 className="step__title">Create & Submit</h3>
              <p className="step__description">
                Build your own game using our templates and submit it to the platform
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="cta">
        <div className="cta__container">
          <h2 className="cta__title">Ready to Play?</h2>
          <p className="cta__subtitle">
            Join the GameForge.js community and start your retro gaming adventure
          </p>
          <div className="cta__buttons">
            <Link to="/register">
              <Button variant="primary" size="large">
                Sign Up Free
              </Button>
            </Link>
            <Link to="/games">
              <Button variant="secondary" size="large">
                Play Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;