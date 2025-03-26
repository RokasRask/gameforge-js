import React from 'react';

/**
 * Game categories navigation component
 * 
 * @param {Object} props - Component props
 * @param {Array} props.categories - Array of category objects with id, name, icon, etc.
 * @param {string} props.activeCategory - Currently active category ID
 * @param {Function} props.onCategoryChange - Handler for category changes
 * @param {string} props.className - Additional CSS class names
 */
const GameCategories = ({
  categories = [],
  activeCategory = 'all',
  onCategoryChange,
  className = ''
}) => {
  // Handle category selection
  const handleCategoryClick = (categoryId) => {
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };
  
  if (categories.length === 0) {
    return null;
  }
  
  return (
    <div className={`game-categories ${className}`}>
      <div className="game-categories__container">
        <ul className="game-categories__list">
          {categories.map((category) => (
            <li key={category.id} className="game-categories__item">
              <button
                className={`game-categories__button ${category.id === activeCategory ? 'is-active' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
                aria-current={category.id === activeCategory ? 'page' : undefined}
              >
                {category.icon && (
                  <span className="game-categories__icon">{category.icon}</span>
                )}
                <span className="game-categories__name">{category.name}</span>
                {category.count !== undefined && (
                  <span className="game-categories__count">{category.count}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GameCategories;