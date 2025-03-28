import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.scss';
import Button from '../../components/Button/Button';
import GameCard from '../../components/GameCard/GameCard';

// Sample featured games data
const featuredGames = [
  {
    id: 1,
    title: "Neon Abyss",
    developer: "Cosmic Games",
    image: "/images/game1.jpg", // You'll need to add your own images
    category: "Action",
    rating: 4.8,
    releaseDate: "2023",
    isFeatured: true
  },
  {
    id: 2,
    title: "Stellar Odyssey",
    developer: "Galaxy Studios",
    image: "/images/game2.jpg",
    category: "RPG",
    rating: 4.5,
    releaseDate: "2023",
    isFeatured: false
  },
  {
    id: 3,
    title: "Quantum Break",
    developer: "Time Games",
    image: "/images/game3.jpg",
    category: "Adventure",
    rating: 4.6,
    releaseDate: "2022",
    isFeatured: false
  }
];

// Sample categories data
const categories = [
  { id: 1, name: "Action", icon: "fa-running", count: 42 },
  { id: 2, name: "Adventure", icon: "fa-map-marked-alt", count: 37 },
  { id: 3, name: "RPG", icon: "fa-dragon", count: 28 },
  { id: 4, name: "Strategy", icon: "fa-chess", count: 24 },
  { id: 5, name: "Puzzle", icon: "fa-puzzle-piece", count: 19 },
  { id: 6, name: "Simulation", icon: "fa-gamepad", count: 15 }
];

const LandingPage = () => {
  // Animation on scroll effect
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
          element.classList.add('animate');
        }
      });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    // Trigger once on load
    animateOnScroll();
    
    return () => window.removeEventListener('scroll', animateOnScroll);
  }, []);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">
            Discover <span className="text-gradient">Indie</span> Games
          </h1>
          <p className="hero__subtitle">
            Your gateway to the best independent game experiences
          </p>
          <div className="hero__buttons">
            <Link to="/games">
              <Button type="primary" size="large">
                <i className="fas fa-gamepad"></i> Browse Games
              </Button>
            </Link>
            <Link to="/contact">
              <Button type="secondary" size="large">
                <i className="fas fa-paper-plane"></i> Submit Game
              </Button>
            </Link>
          </div>
          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-number">100+</span>
              <span className="hero__stat-label">Indie Games</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-number">50+</span>
              <span className="hero__stat-label">Developers</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-number">10k+</span>
              <span className="hero__stat-label">Players</span>
            </div>
          </div>
        </div>
        <div className="hero__decoration">
          <div className="hero__circles"></div>
          <div className="hero__grid"></div>
        </div>
      </section>
      
      {/* Featured Games Section */}
      <section className="section section--gradient">
        <div className="container">
          <div className="section__header animate-on-scroll">
            <h2 className="section__title">Featured Games</h2>
            <p className="section__subtitle">
              Check out our handpicked selection of amazing indie games
            </p>
          </div>
          
          <div className="grid grid--autofit featured-games animate-on-scroll">
            {featuredGames.map(game => (
              <GameCard key={game.id} {...game} />
            ))}
          </div>
          
          <div className="text-center mt-xl">
            <Link to="/games">
              <Button type="primary">
                View All Games <i className="fas fa-arrow-right"></i>
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="section">
        <div className="container">
          <div className="section__header animate-on-scroll">
            <h2 className="section__title">Game Categories</h2>
            <p className="section__subtitle">
              Browse games by your favorite genre
            </p>
          </div>
          
          <div className="categories animate-on-scroll">
            {categories.map(category => (
              <Link 
                to={`/games/category/${category.name.toLowerCase()}`} 
                className="category-card" 
                key={category.id}
              >
                <div className="category-card__icon">
                  <i className={`fas ${category.icon}`}></i>
                </div>
                <h3 className="category-card__title">{category.name}</h3>
                <p className="category-card__count">{category.count} Games</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta animate-on-scroll">
        <div className="container">
          <div className="cta__content">
            <h2 className="cta__title">Got a Game to Share?</h2>
            <p className="cta__text">
              Are you an indie developer looking to showcase your game? 
              Submit your creation to our platform and reach thousands of players!
            </p>
            <Link to="/contact">
              <Button type="secondary" size="large">
                Submit Your Game
              </Button>
            </Link>
          </div>
          <div className="cta__decoration">
            <div className="cta__decoration-circle"></div>
            <div className="cta__decoration-lines"></div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter__content animate-on-scroll">
            <h2 className="newsletter__title">Stay in the Loop</h2>
            <p className="newsletter__text">
              Subscribe to our newsletter for the latest indie game releases and news
            </p>
            <form className="newsletter__form">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="newsletter__input"
                aria-label="Email for newsletter"
              />
              <Button type="primary">
                Subscribe <i className="fas fa-paper-plane"></i>
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;