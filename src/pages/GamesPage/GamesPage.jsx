import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './GamesPage.scss';
import GameCard from '../../components/GameCard/GameCard';
import Button from '../../components/Button/Button';

// Sample games data
const allGames = [
  {
    id: 1,
    title: "Neon Abyss",
    developer: "Cosmic Games",
    image: "/images/game1.jpg",
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
  },
  {
    id: 4,
    title: "Pixel Dungeon",
    developer: "Retro Labs",
    image: "/images/game4.jpg",
    category: "Puzzle",
    rating: 4.3,
    releaseDate: "2022",
    isFeatured: false
  },
  {
    id: 5,
    title: "Space Commanders",
    developer: "Star Studios",
    image: "/images/game5.jpg",
    category: "Strategy",
    rating: 4.7,
    releaseDate: "2023",
    isFeatured: false
  },
  {
    id: 6,
    title: "Shadow Legends",
    developer: "Dark Arts Games",
    image: "/images/game6.jpg",
    category: "RPG",
    rating: 4.4,
    releaseDate: "2022",
    isFeatured: false
  },
  {
    id: 7,
    title: "Cyber Racer",
    developer: "Neon Studios",
    image: "/images/game7.jpg",
    category: "Action",
    rating: 4.2,
    releaseDate: "2023",
    isFeatured: false
  },
  {
    id: 8,
    title: "Forest Mystery",
    developer: "Nature Games",
    image: "/images/game8.jpg",
    category: "Adventure",
    rating: 4.5,
    releaseDate: "2022",
    isFeatured: false
  },
  {
    id: 9,
    title: "Mind Bender",
    developer: "Puzzle Masters",
    image: "/images/game9.jpg",
    category: "Puzzle",
    rating: 4.1,
    releaseDate: "2023",
    isFeatured: false
  }
];

const categories = [
  "All",
  "Action",
  "Adventure",
  "RPG",
  "Strategy",
  "Puzzle",
  "Simulation"
];

const GamesPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [filteredGames, setFilteredGames] = useState([]);
  const [activeCategory, setActiveCategory] = useState(categoryName || 'All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 6;
  
  // Filter, sort, and paginate games
  useEffect(() => {
    let filtered = [...allGames];
    
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
        game.developer.toLowerCase().includes(term)
      );
    }
    
    // Sort games
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => parseInt(b.releaseDate) - parseInt(a.releaseDate));
        break;
      case 'oldest':
        filtered.sort((a, b) => parseInt(a.releaseDate) - parseInt(b.releaseDate));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    
    setFilteredGames(filtered);
    setCurrentPage(1); // Reset to first page when filtering/sorting
  }, [activeCategory, searchTerm, sortBy]);
  
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
          <h1 className="games-header__title">Game Library</h1>
          <p className="games-header__subtitle">
            Browse our collection of the best indie games
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
              <option value="rating">Highest Rated</option>
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
            <i className="fas fa-search games-empty__icon"></i>
            <h2 className="games-empty__title">No Games Found</h2>
            <p className="games-empty__text">
              We couldn't find any games matching your search criteria.
            </p>
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
                <GameCard key={game.id} {...game} />
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