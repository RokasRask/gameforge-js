import React, { useState } from 'react';

/**
 * 8-bit style search bar component
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSearch - Function called when search is performed
 * @param {string} props.placeholder - Placeholder text for the input
 * @param {string} props.initialValue - Initial search value
 * @param {string} props.className - Additional CSS class names
 */
const SearchBar = ({ 
  onSearch, 
  placeholder = 'Search...', 
  initialValue = '',
  className = '' 
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  
  // Handle input change
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle search submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm.trim());
    }
  };
  
  // Handle clearing the search
  const handleClear = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };
  
  return (
    <form className={`search-bar ${className}`} onSubmit={handleSubmit}>
      <div className="search-bar__container">
        {/* Search input */}
        <input
          type="text"
          className="search-bar__input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
          aria-label="Search"
        />
        
        {/* Clear button (shows only when there's text) */}
        {searchTerm && (
          <button
            type="button"
            className="search-bar__clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
        
        {/* Submit button */}
        <button
          type="submit"
          className="search-bar__submit"
          aria-label="Submit search"
        >
          <span className="search-bar__submit-icon">🔍</span>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;