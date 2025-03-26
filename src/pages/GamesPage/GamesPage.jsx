import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GamesList from '../../components/games/GamesList/GamesList';
import SearchBar from '../../components/common/SearchBar/SearchBar';
import FilterMenu from '../../components/common/FilterMenu/FilterMenu';
import GameCategories from '../../components/games/GameCategories/GameCategories';
import Button from '../../components/common/Button/Button';

/**
 * Games listing page
 */
const GamesPage = () => {
  // State for games and filtering
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  // Load games data
  useEffect(() => {
    // Simulating API call
    const fetchGames = async () => {
      setIsLoading(true);
      try {
        // This would be an API call in production
        const sampleGames = [
          {
            id: 'game1',
            title: 'Pixel Platformer',
            thumbnail: 'https://via.placeholder.com/350x200/3498db/ffffff?text=Pixel+Platformer',
            description: 'Jump and run through challenging levels in this retro platformer.',
            category: 'platformer',
            rating: 4.5,
            plays: 1250,
            tags: ['platformer', 'action', 'retro'],
            createdAt: '2023-09-15T12:00:00Z'
          },
          {
            id: 'game2',
            title: 'Space Shooter',
            thumbnail: 'https://via.placeholder.com/350x200/e74c3c/ffffff?text=Space+Shooter',
            description: 'Defend Earth from alien invaders in this classic arcade shooter.',
            category: 'arcade',
            rating: 4.2,
            plays: 980,
            tags: ['arcade', 'shooter', 'space'],
            createdAt: '2023-08-22T15:30:00Z'
          },
          {
            id: 'game3',
            title: 'Puzzle Quest',
            thumbnail: 'https://via.placeholder.com/350x200/2ecc71/ffffff?text=Puzzle+Quest',
            description: 'Solve mind-bending puzzles in this brain-teasing adventure.',
            category: 'puzzle',
            rating: 4.7,
            plays: 1540,
            tags: ['puzzle', 'strategy', 'adventure'],
            createdAt: '2023-10-05T09:45:00Z'
          },
          {
            id: 'game4',
            title: 'Retro RPG',
            thumbnail: 'https://via.placeholder.com/350x200/9b59b6/ffffff?text=Retro+RPG',
            description: 'Embark on an epic quest in this turn-based role-playing game.',
            category: 'rpg',
            rating: 4.9,
            plays: 2100,
            tags: ['rpg', 'adventure', 'turn-based'],
            createdAt: '2023-10-12T14:20:00Z'
          },
          {
            id: 'game5',
            title: 'Strategy Master',
            thumbnail: 'https://via.placeholder.com/350x200/f39c12/ffffff?text=Strategy+Master',
            description: 'Plan, build, and conquer in this challenging strategy game.',
            category: 'strategy',
            rating: 4.3,
            plays: 870,
            tags: ['strategy', 'building', 'resource-management'],
            createdAt: '2023-09-28T08:15:00Z'
          },
          {
            id: 'game6',
            title: 'Pixel Sports',
            thumbnail: 'https://via.placeholder.com/350x200/1abc9c/ffffff?text=Pixel+Sports',
            description: 'Compete in various sports events with simple yet addictive gameplay.',
            category: 'sports',
            rating: 4.0,
            plays: 750,
            tags: ['sports', 'multiplayer', 'competitive'],
            createdAt: '2023-09-10T16:45:00Z'
          }
        ];
        
        // Simulate network delay
        setTimeout(() => {
          setGames(sampleGames);
          setFilteredGames(sampleGames);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching games:', error);
        setIsLoading(false);
      }
    };
    
    fetchGames();
  }, []);
  
  // Apply filters when search query, category, or sort option changes
  useEffect(() => {
    if (games.length === 0) return;
    
    let result = [...games];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(game => 
        game.title.toLowerCase().includes(query) || 
        game.description.toLowerCase().includes(query) ||
        game.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter(game => game.category === activeCategory);
    }
    
    // Sort games
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'popular':
        result.sort((a, b) => b.plays - a.plays);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    
    setFilteredGames(result);
  }, [games, searchQuery, activeCategory, sortBy]);
  
  // Handle search input
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  
  // Handle category selection
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };
  
  // Handle sort selection
  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
  };
  
  // Categories for filter menu
  const categories = [
    { id: 'all', name: 'All Games', icon: '🎮' },
    { id: 'arcade', name: 'Arcade', icon: '🕹️' },
    { id: 'puzzle', name: 'Puzzle', icon: '🧩' },
    { id: 'platformer', name: 'Platformer', icon: '👾' },
    { id: 'strategy', name: 'Strategy', icon: '♟️' },
    { id: 'rpg', name: 'RPG', icon: '⚔️' },
    { id: 'sports', name: 'Sports', icon: '🏀' }
  ];
  
  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' }
  ];
  
  return (
    <div className="games-page">
      {/* Page header */}
      <div className="games-page__header">
        <h1 className="games-page__title">Games Library</h1>
        <p className="games-page__subtitle">
          Browse our collection of JavaScript and React powered retro games
        </p>
      </div>
      
      {/* Search and filters */}
      <div className="games-page__controls">
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Search games..." 
          className="games-page__search"
        />
        <FilterMenu 
          sortOptions={sortOptions}
          currentSort={sortBy}
          onSortChange={handleSortChange}
          className="games-page__filter"
        />
      </div>
      
      {/* Game categories */}
      <GameCategories 
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        className="games-page__categories"
      />
      
      {/* Games list */}
      <div className="games-page__content">
        {isLoading ? (
          <div className="games-page__loading">
            <div className="pixel-loader"></div>
            <p>Loading games...</p>
          </div>
        ) : (
          <>
            {filteredGames.length > 0 ? (
              <GamesList games={filteredGames} />
            ) : (
              <div className="games-page__empty">
                <div className="games-page__empty-icon">🔍</div>
                <h2 className="games-page__empty-title">No Games Found</h2>
                <p className="games-page__empty-message">
                  Try adjusting your search or filter settings
                </p>
                <Button 
                  variant="primary"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                    setSortBy('newest');
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Submit your game CTA */}
      <div className="games-page__cta">
        <div className="games-page__cta-content">
          <h2 className="games-page__cta-title">Want to see your game here?</h2>
          <p className="games-page__cta-text">
            Submit your JavaScript or React game to our platform and join the GameForge.js community!
          </p>
          <Link to="/contact" className="games-page__cta-button">
            Contact Us
          </Link>
        </div>
        <div className="games-page__cta-decoration"></div>
      </div>
    </div>
  );
};

export default GamesPage;