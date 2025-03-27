import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gameRegistry from '../../utils/gameRegistry';

/**
 * AdminDashboard - Main admin dashboard component
 */
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalGames: 0,
    totalPlays: 0,
    categories: [],
    recentGames: []
  });
  
  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Get all games
        const allGames = gameRegistry.getAllGames();
        
        // Calculate total plays
        const totalPlays = allGames.reduce((sum, game) => sum + (game.plays || 0), 0);
        
        // Get categories with counts
        const categories = gameRegistry.getAllCategories();
        
        // Get recent games (sorted by dateAdded)
        const recentGames = [...allGames]
          .sort((a, b) => {
            const dateA = new Date(a.dateAdded || a.lastUpdated);
            const dateB = new Date(b.dateAdded || b.lastUpdated);
            return dateB - dateA;
          })
          .slice(0, 5);
        
        // Update stats
        setStats({
          totalGames: allGames.length,
          totalPlays,
          categories,
          recentGames
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };
    
    loadDashboardData();
  }, []);
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="admin-dashboard">
      <h1 className="admin-dashboard__title">Dashboard</h1>
      
      {/* Stats overview */}
      <div className="admin-dashboard__stats">
        <div className="admin-dashboard__stat-card">
          <h3 className="admin-dashboard__stat-title">Total Games</h3>
          <div className="admin-dashboard__stat-value">{stats.totalGames}</div>
          <Link to="/admin/games" className="admin-dashboard__stat-action">View All</Link>
        </div>
        
        <div className="admin-dashboard__stat-card">
          <h3 className="admin-dashboard__stat-title">Total Plays</h3>
          <div className="admin-dashboard__stat-value">{stats.totalPlays.toLocaleString()}</div>
        </div>
        
        <div className="admin-dashboard__stat-card">
          <h3 className="admin-dashboard__stat-title">Categories</h3>
          <div className="admin-dashboard__stat-value">{stats.categories.length}</div>
          <Link to="/admin/categories" className="admin-dashboard__stat-action">Manage</Link>
        </div>
      </div>
      
      {/* Recent games */}
      <section className="admin-dashboard__section">
        <h2 className="admin-dashboard__section-title">Recent Games</h2>
        
        <div className="admin-dashboard__table-container">
          <table className="admin-dashboard__table">
            <thead>
              <tr>
                <th>Game</th>
                <th>Category</th>
                <th>Creator</th>
                <th>Added</th>
                <th>Plays</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentGames.map(game => (
                <tr key={game.id}>
                  <td>
                    <div className="admin-dashboard__game-info">
                      <img 
                        src={game.thumbnail} 
                        alt={game.title}
                        className="admin-dashboard__game-thumb"
                      />
                      <span className="admin-dashboard__game-title">{game.title}</span>
                    </div>
                  </td>
                  <td>{game.category}</td>
                  <td>{game.creator?.name || 'Unknown'}</td>
                  <td>{formatDate(game.dateAdded || game.lastUpdated)}</td>
                  <td>{game.plays.toLocaleString()}</td>
                  <td>
                    <div className="admin-dashboard__actions">
                      <Link 
                        to={`/admin/games/edit/${game.id}`}
                        className="admin-dashboard__action admin-dashboard__action--edit"
                      >
                        Edit
                      </Link>
                      <Link 
                        to={`/games/${game.id}`}
                        className="admin-dashboard__action admin-dashboard__action--view"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {stats.recentGames.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-dashboard__empty">
                    No games available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      
      {/* Category breakdown */}
      <section className="admin-dashboard__section">
        <h2 className="admin-dashboard__section-title">Categories</h2>
        
        <div className="admin-dashboard__categories">
          {stats.categories.map(category => (
            <div key={category.id} className="admin-dashboard__category-card">
              <h3 className="admin-dashboard__category-name">{category.name}</h3>
              <div className="admin-dashboard__category-count">{category.count} games</div>
              <Link 
                to={`/admin/games?category=${category.id}`}
                className="admin-dashboard__category-action"
              >
                View Games
              </Link>
            </div>
          ))}
          {stats.categories.length === 0 && (
            <div className="admin-dashboard__empty">
              No categories available.
            </div>
          )}
        </div>
      </section>
      
      {/* Quick actions */}
      <section className="admin-dashboard__section">
        <h2 className="admin-dashboard__section-title">Quick Actions</h2>
        
        <div className="admin-dashboard__actions-grid">
          <Link to="/admin/games/add" className="admin-dashboard__quick-action">
            <div className="admin-dashboard__quick-action-icon">➕</div>
            <span className="admin-dashboard__quick-action-text">Add New Game</span>
          </Link>
          
          <Link to="/admin/categories" className="admin-dashboard__quick-action">
            <div className="admin-dashboard__quick-action-icon">🗂️</div>
            <span className="admin-dashboard__quick-action-text">Manage Categories</span>
          </Link>
          
          <Link to="/admin/reviews" className="admin-dashboard__quick-action">
            <div className="admin-dashboard__quick-action-icon">⭐</div>
            <span className="admin-dashboard__quick-action-text">Moderate Reviews</span>
          </Link>
          
          <Link to="/admin/settings" className="admin-dashboard__quick-action">
            <div className="admin-dashboard__quick-action-icon">⚙️</div>
            <span className="admin-dashboard__quick-action-text">Settings</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;