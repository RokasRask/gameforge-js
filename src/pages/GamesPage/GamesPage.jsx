import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './GamesPage.scss';
import GameCard from '../../components/GameCard/GameCard';
import Button from '../../components/Button/Button';

const categories = [
  "All",
  "Canvas",
  "WebGL",
  "React",
  "Phaser",
  "p5.js",
  "Three.js"
];

const GamesPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [activeCategory, setActiveCategory] = useState(categoryName || 'All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 6;
  
  // Load games from localStorage
  useEffect(() => {
    const storedGames = localStorage.getItem('gameforge-games');
    if (storedGames) {
      setGames(JSON.parse(storedGames));
    }
  }, []);
  
  // Filter, sort, and paginate games
  useEffect(() => {
    let filtered = [...games];
    
    // Filter by category
    if (activeCategory && activeCategory !== 'All') {
      filtered = filtered.filter(game => 
        game.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(game => 
        game.title.toLowerCase().includes(term) || 
        game.creator.toLowerCase().includes(term) ||
        (game.description && game.description.toLowerCase().includes(term))
      );
    }
    
    // Sort games
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    
    setFilteredGames(filtered);
    setCurrentPage(1); // Reset to first page when filtering/sorting
  }, [activeCategory, searchTerm, sortBy, games]);
  
  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    if (category === 'All') {
      navigate('/games');
    } else {
      navigate(`/games/category/${category.toLowerCase()}`);
    }
  };
  
  // Pagination logic
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);
  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  return (
    <div className="games-page">
      <div className="games-header">
        <div className="container">
          <h1 className="games-header__title">JavaScript Game Library</h1>
          <p className="games-header__subtitle">
            Browse our collection of browser-based JavaScript games
          </p>
        </div>
      </div>
      
      <div className="container">
        <div className="games-toolbar">
          <div className="games-search">
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="games-search__input"
            />
            <i className="fas fa-search games-search__icon"></i>
          </div>
          
          <div className="games-sort">
            <label htmlFor="sort-select" className="games-sort__label">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="games-sort__select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>
        
        <div className="games-categories">
          {categories.map((category) => (
            <button
              key={category}
              className={`games-categories__btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        {filteredGames.length === 0 ? (
          <div className="games-empty">
            <i className="fas fa-gamepad games-empty__icon"></i>
            <h2 className="games-empty__title">No Games Found</h2>
            {games.length === 0 ? (
              <p className="games-empty__text">
                There are no games in the library yet.
              </p>
            ) : (
              <p className="games-empty__text">
                We couldn't find any games matching your search criteria.
              </p>
            )}
            <Button 
              type="secondary" 
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('All');
                navigate('/games');
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="games-results">
              <p className="games-results__count">
                Showing {currentGames.length} of {filteredGames.length} games
              </p>
            </div>
            
            <div className="games-grid">
              {currentGames.map(game => (
                <GameCard 
                  key={game.id} 
                  id={game.id}
                  title={game.title}
                  creator={game.creator}
                  thumbnailUrl={game.thumbnailUrl}
                  category={game.category}
                  description={game.description}
                  dateAdded={game.dateAdded}
                  isFeatured={game.featured}
                />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="games-pagination">
                <button
                  className="games-pagination__btn"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                
                <div className="games-pagination__pages">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => paginate(index + 1)}
                      className={`games-pagination__page ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                
                <button
                  className="games-pagination__btn"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GamesPage;