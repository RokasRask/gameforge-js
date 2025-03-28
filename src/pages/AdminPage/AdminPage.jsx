import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './AdminPage.scss';
import Button from '../../components/Button/Button';

const AdminPage = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    title: '',
    creator: '',
    description: '',
    category: 'Canvas',
    thumbnail: null,
    thumbnailPreview: null,
    gameFiles: [],
    featured: false
  });

  // State for games list
  const [games, setGames] = useState([]);

  // Load games from localStorage on component mount
  useEffect(() => {
    const storedGames = localStorage.getItem('gameforge-games');
    if (storedGames) {
      setGames(JSON.parse(storedGames));
    }
  }, []);

  // Save games to localStorage whenever the games state changes
  useEffect(() => {
    localStorage.setItem('gameforge-games', JSON.stringify(games));
  }, [games]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle thumbnail upload
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create URL for preview
      const previewUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        thumbnail: file,
        thumbnailPreview: previewUrl
      });
    }
  };

  // Handle game files upload
  const handleGameFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      gameFiles: [...formData.gameFiles, ...files]
    });
  };

  // Remove a game file from the list
  const removeGameFile = (index) => {
    const updatedFiles = [...formData.gameFiles];
    updatedFiles.splice(index, 1);
    setFormData({
      ...formData,
      gameFiles: updatedFiles
    });
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.creator || !formData.description || !formData.thumbnail) {
      toast.error('Please fill out all required fields and upload a thumbnail');
      return;
    }

    if (formData.gameFiles.length === 0) {
      toast.error('Please upload at least one game file');
      return;
    }

    try {
      // Create game ID
      const gameId = `game-${Date.now()}`;
      
      // Store the thumbnail as a base64 string
      const thumbnailBase64 = await convertFileToBase64(formData.thumbnail);
      
      // Store game files as base64 strings
      const gameFilesData = await Promise.all(
        formData.gameFiles.map(async (file) => {
          const base64Data = await convertFileToBase64(file);
          return {
            name: file.name,
            type: file.type,
            content: base64Data,
          };
        })
      );

      // Create new game object
      const newGame = {
        id: gameId,
        title: formData.title,
        creator: formData.creator,
        description: formData.description,
        category: formData.category,
        thumbnailUrl: thumbnailBase64,
        gameFiles: gameFilesData.map(file => ({
          name: file.name,
          type: file.type,
          path: `${gameId}/${file.name}`
        })),
        featured: formData.featured,
        dateAdded: new Date().toISOString()
      };

      // Store the game files in localStorage (in a real app, this would be a server upload)
      // Create a game files storage object if it doesn't exist
      const gameFilesStorage = JSON.parse(localStorage.getItem('gameforge-files') || '{}');
      
      // Store each file under the game's ID
      gameFilesStorage[gameId] = {
        files: gameFilesData
      };
      
      localStorage.setItem('gameforge-files', JSON.stringify(gameFilesStorage));

      // Add to games array
      setGames([...games, newGame]);

      // Reset form
      setFormData({
        title: '',
        creator: '',
        description: '',
        category: 'Canvas',
        thumbnail: null,
        thumbnailPreview: null,
        gameFiles: [],
        featured: false
      });

      // Show success message
      toast.success('Game added successfully!');
    } catch (error) {
      console.error('Error adding game:', error);
      toast.error('Failed to add game. Please try again.');
    }
  };

  // Helper function to convert File to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Delete a game
  const deleteGame = (id) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      const updatedGames = games.filter(game => game.id !== id);
      setGames(updatedGames);
      toast.success('Game deleted successfully');
    }
  };

  // Toggle featured status
  const toggleFeatured = (id) => {
    const updatedGames = games.map(game => {
      if (game.id === id) {
        return { ...game, featured: !game.featured };
      }
      return game;
    });
    setGames(updatedGames);
    toast.success('Featured status updated');
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container">
          <h1 className="admin-header__title">Admin Dashboard</h1>
          <p className="admin-header__subtitle">
            Manage games and website content
          </p>
        </div>
      </div>

      <div className="container">
        <div className="admin-content">
          <div className="admin-sidebar">
            <ul className="admin-nav">
              <li className="admin-nav__item admin-nav__item--active">
                <span className="admin-nav__link">
                  <i className="fas fa-gamepad"></i> Games
                </span>
              </li>
              <li className="admin-nav__item">
                <span className="admin-nav__link">
                  <i className="fas fa-users"></i> Users
                </span>
              </li>
              <li className="admin-nav__item">
                <span className="admin-nav__link">
                  <i className="fas fa-cog"></i> Settings
                </span>
              </li>
            </ul>
          </div>

          <div className="admin-main">
            <div className="admin-card">
              <h2 className="admin-card__title">Add New Game</h2>
              <form className="admin-form" onSubmit={handleSubmit}>
                <div className="admin-form__group">
                  <label htmlFor="title" className="admin-form__label">Game Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="admin-form__input"
                    required
                  />
                </div>

                <div className="admin-form__group">
                  <label htmlFor="creator" className="admin-form__label">Creator *</label>
                  <input
                    type="text"
                    id="creator"
                    name="creator"
                    value={formData.creator}
                    onChange={handleInputChange}
                    className="admin-form__input"
                    required
                  />
                </div>

                <div className="admin-form__group">
                  <label htmlFor="category" className="admin-form__label">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="admin-form__select"
                    required
                  >
                    <option value="Canvas">Canvas</option>
                    <option value="WebGL">WebGL</option>
                    <option value="React">React</option>
                    <option value="Phaser">Phaser</option>
                    <option value="p5.js">p5.js</option>
                    <option value="Three.js">Three.js</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="admin-form__group">
                  <label htmlFor="description" className="admin-form__label">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="admin-form__textarea"
                    rows="4"
                    required
                  ></textarea>
                </div>

                <div className="admin-form__group">
                  <label htmlFor="thumbnail" className="admin-form__label">Thumbnail Image *</label>
                  <div className="admin-form__file-upload">
                    <input
                      type="file"
                      id="thumbnail"
                      name="thumbnail"
                      onChange={handleThumbnailChange}
                      className="admin-form__file"
                      accept="image/*"
                    />
                    <label htmlFor="thumbnail" className="admin-form__file-label">
                      <i className="fas fa-cloud-upload-alt"></i>
                      <span>Choose file</span>
                    </label>
                  </div>
                  {formData.thumbnailPreview && (
                    <div className="admin-form__preview">
                      <img src={formData.thumbnailPreview} alt="Thumbnail preview" className="admin-form__thumbnail" />
                    </div>
                  )}
                </div>

                <div className="admin-form__group">
                  <label htmlFor="gameFiles" className="admin-form__label">Game Files *</label>
                  <div className="admin-form__file-upload">
                    <input
                      type="file"
                      id="gameFiles"
                      name="gameFiles"
                      onChange={handleGameFilesChange}
                      className="admin-form__file"
                      multiple
                    />
                    <label htmlFor="gameFiles" className="admin-form__file-label">
                      <i className="fas fa-cloud-upload-alt"></i>
                      <span>Choose files</span>
                    </label>
                  </div>
                  {formData.gameFiles.length > 0 && (
                    <div className="admin-form__file-list">
                      <h4>Selected Files:</h4>
                      <ul>
                        {formData.gameFiles.map((file, index) => (
                          <li key={index} className="admin-form__file-item">
                            {file.name}
                            <button
                              type="button"
                              className="admin-form__file-remove"
                              onClick={() => removeGameFile(index)}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="admin-form__group admin-form__group--checkbox">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="admin-form__checkbox"
                  />
                  <label htmlFor="featured" className="admin-form__checkbox-label">
                    Featured Game
                  </label>
                </div>

                <div className="admin-form__actions">
                  <Button type="primary" size="large">
                    Add Game
                  </Button>
                </div>
              </form>
            </div>

            <div className="admin-card">
              <h2 className="admin-card__title">Games List</h2>
              {games.length === 0 ? (
                <p className="admin-card__empty">No games added yet. Add your first game using the form above.</p>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Thumbnail</th>
                        <th>Title</th>
                        <th>Creator</th>
                        <th>Category</th>
                        <th>Date Added</th>
                        <th>Featured</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {games.map(game => (
                        <tr key={game.id}>
                          <td>
                            {game.thumbnailUrl ? (
                              <img
                                src={game.thumbnailUrl}
                                alt={game.title}
                                className="admin-table__thumbnail"
                              />
                            ) : (
                              <div className="admin-table__thumbnail-placeholder">
                                <i className="fas fa-image"></i>
                              </div>
                            )}
                          </td>
                          <td>{game.title}</td>
                          <td>{game.creator}</td>
                          <td>{game.category}</td>
                          <td>{new Date(game.dateAdded).toLocaleDateString()}</td>
                          <td>
                            <button
                              className={`admin-table__featured-toggle ${game.featured ? 'active' : ''}`}
                              onClick={() => toggleFeatured(game.id)}
                            >
                              <i className={`fas fa-${game.featured ? 'star' : 'star'}`}></i>
                            </button>
                          </td>
                          <td>
                            <div className="admin-table__actions">
                              <button className="admin-table__action admin-table__action--edit">
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="admin-table__action admin-table__action--delete"
                                onClick={() => deleteGame(game.id)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;