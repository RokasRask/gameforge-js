import React, { useState, useRef, useEffect } from 'react';

/**
 * Filter and sort menu component with 8-bit styling
 * 
 * @param {Object} props - Component props
 * @param {Array} props.sortOptions - Array of sort options {value, label}
 * @param {string} props.currentSort - Currently selected sort option value
 * @param {Function} props.onSortChange - Handler for sort option changes
 * @param {Array} props.filterOptions - Array of filter options (optional)
 * @param {Array} props.currentFilters - Currently applied filters (optional)
 * @param {Function} props.onFilterChange - Handler for filter changes (optional)
 * @param {string} props.className - Additional CSS class names
 */
const FilterMenu = ({
  sortOptions = [],
  currentSort = '',
  onSortChange,
  filterOptions = [],
  currentFilters = [],
  onFilterChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  
  // Get current sort option label
  const currentSortLabel = sortOptions.find(option => option.value === currentSort)?.label || 'Sort by';
  
  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  // Handle sort option selection
  const handleSortSelect = (value) => {
    if (onSortChange) {
      onSortChange(value);
    }
    setIsOpen(false);
  };
  
  // Handle filter toggle
  const handleFilterToggle = (value) => {
    if (onFilterChange) {
      const isActive = currentFilters.includes(value);
      if (isActive) {
        // Remove filter
        onFilterChange(currentFilters.filter(f => f !== value));
      } else {
        // Add filter
        onFilterChange([...currentFilters, value]);
      }
    }
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className={`filter-menu ${className}`} ref={menuRef}>
      {/* Toggle button */}
      <button
        className="filter-menu__toggle"
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="filter-menu__toggle-text">{currentSortLabel}</span>
        <span className="filter-menu__toggle-icon">▼</span>
      </button>
      
      {/* Dropdown content */}
      {isOpen && (
        <div className="filter-menu__dropdown">
          {/* Sort options */}
          {sortOptions.length > 0 && (
            <div className="filter-menu__section">
              <h3 className="filter-menu__section-title">Sort by</h3>
              <ul className="filter-menu__options">
                {sortOptions.map((option) => (
                  <li key={option.value} className="filter-menu__option">
                    <button
                      className={`filter-menu__option-button ${option.value === currentSort ? 'is-active' : ''}`}
                      onClick={() => handleSortSelect(option.value)}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Filter options (if available) */}
          {filterOptions.length > 0 && (
            <div className="filter-menu__section">
              <h3 className="filter-menu__section-title">Filter</h3>
              <ul className="filter-menu__options">
                {filterOptions.map((option) => (
                  <li key={option.value} className="filter-menu__option">
                    <label className="filter-menu__checkbox">
                      <input
                        type="checkbox"
                        checked={currentFilters.includes(option.value)}
                        onChange={() => handleFilterToggle(option.value)}
                      />
                      <span className="filter-menu__checkbox-text">{option.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterMenu;