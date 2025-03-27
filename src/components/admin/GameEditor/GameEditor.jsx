import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gameRegistry from '../../../games/utils/gameRegistry';

/**
 * GameEditor - Form for adding or editing a game
 */
const GameEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    longDescription: '',
    category: '',
    tags: '',
    creatorName: '',
    creatorWebsite: '',
    controls: {},
  });
  
  // UI state
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gameThumbnail, setGameThumbnail] = useState(null);
  const [gameScreenshots, setGameScreenshots] = useState([]);
  const [gameFiles, setGameFiles] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  
  // Load the game data in edit mode
  useEffect(() => {
    const loadGameData = async () => {
      if (!isEditMode) return;
      
      try {
        setIsLoading(true);
        
        // Get game data
        const game = gameRegistry.getGameById(id);
        
        if (!game) {
          throw new Error(`Game with ID ${id} not found`);
        }
        
        // Set form data
        setFormData({
          title: game.title || '',
          slug: game.slug || '',
          description: game.description || '',
          longDescription: game.longDescription || '',
          category: game.category || '',
          tags: game.tags ? game.tags.join(', ') : '',
          creatorName: game.creator?.name || '',
          creatorWebsite: game.creator?.website || '',
          controls: game.controls || {},
        });
        
        // Set thumbnail and screenshots
        // In a real implementation, we would show the actual images
        // For now, we'll just store the URLs
        if (game.thumbnail) {
          setGameThumbnail(game.thumbnail);
        }
        
        if (game.screenshots && game.screenshots.length > 0) {
          setGameScreenshots(game.screenshots);
        }
      } catch (error) {
        console.error('Error loading game data:', error);
        // Show error message to user
      } finally {
        setIsLoading(false);
      }
    };
    
    loadGameData();
  }, [id, isEditMode]);
  
  // Load available categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = gameRegistry.getAllCategories();
        setAvailableCategories(categories);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    
    loadCategories();
  }, []);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
    
    // Auto-generate slug from title
    if (name === 'title' && !isEditMode) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')  // Remove special characters
        .replace(/\s+/g, '-')      // Replace spaces with hyphens
        .replace(/-+/g, '-')       // Remove consecutive hyphens
        .trim();
        
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
  };
  
  // Handle control field changes
  const handleControlChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      controls: {
        ...prev.controls,
        [key]: value
      }
    }));
  };
  
  // Add new control field
  const addControlField = () => {
    setFormData(prev => ({
      ...prev,
      controls: {
        ...prev.controls,
        '': ''
      }
    }));
  };
  
  // Remove control field
  const removeControlField = (key) => {
    const newControls = { ...formData.controls };
    delete newControls[key];
    
    setFormData(prev => ({
      ...prev,
      controls: newControls
    }));
  };
  
  // Handle thumbnail upload
  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // In a real implementation, we would upload the file to the server
    // For now, we'll just create a blob URL for preview
    const imageUrl = URL.createObjectURL(file);
    setGameThumbnail(imageUrl);
  };
  
  // Handle screenshots upload
  const handleScreenshotsUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // In a real implementation, we would upload the files to the server
    // For now, we'll just create blob URLs for preview
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setGameScreenshots(prev => [...prev, ...imageUrls]);
  };
  
  // Handle game files upload
  const handleGameFilesUpload = (e) => {
    const files = e.target.files;
    if (files.length === 0) return;
    
    // In a real implementation, we would validate and store the files
    // For now, we'll just store the FileList object
    setGameFiles(files);
  };
  
  // Remove screenshot
  const removeScreenshot = (index) => {
    setGameScreenshots(prev => prev.filter((_, i) => i !== index));
  };
  
  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.title) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.slug) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
    }
    
    if (!formData.description) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.creatorName) {
      newErrors.creatorName = 'Creator name is required';
    }
    
    // File uploads (only required in add mode)
    if (!isEditMode) {
      if (!gameThumbnail) {
        newErrors.thumbnail = 'Thumbnail image is required';
      }
      
      if (!gameFiles) {
        newErrors.gameFiles = 'Game files are required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert tags string to array
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      // Prepare game data
      const gameData = {
        id: isEditMode ? id : formData.slug,
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        longDescription: formData.longDescription,
        thumbnail: gameThumbnail,
        screenshots: gameScreenshots,
        category: formData.category,
        tags: tagsArray,
        creator: {
          name: formData.creatorName,
          website: formData.creatorWebsite
        },
        controls: formData.controls,
        // These values would be managed by the system
        rating: isEditMode ? gameRegistry.getGameById(id).rating : 0,
        ratingCount: isEditMode ? gameRegistry.getGameById(id).ratingCount : 0,
        plays: isEditMode ? gameRegistry.getGameById(id).plays : 0,
        dateAdded: isEditMode ? gameRegistry.getGameById(id).dateAdded : new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      // In a real implementation, we would:
      // 1. Upload the files to the server
      // 2. Create or update the game in the database
      // 3. Update the game registry
      
      // For this example, we'll just show a success message
      console.log('Game data submitted:', gameData);
      
      // Simulate successful submission
      setTimeout(() => {
        alert(`Game ${isEditMode ? 'updated' : 'added'} successfully!`);
        navigate('/admin/games');
      }, 1000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while saving the game. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <div className="game-editor__loading">Loading game data...</div>;
  }
  
  return (
    <div className="game-editor">
      <h1 className="game-editor__title">
        {isEditMode ? `Edit Game: ${formData.title}` : 'Add New Game'}
      </h1>
      
      <form className="game-editor__form" onSubmit={handleSubmit}>
        <div className="game-editor__form-grid">
          {/* Basic Info Section */}
          <section className="game-editor__section">
            <h2 className="game-editor__section-title">Basic Information</h2>
            
            <div className="game-editor__field">
              <label htmlFor="title" className="game-editor__label">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`game-editor__input ${errors.title ? 'is-invalid' : ''}`}
              />
              {errors.title && <div className="game-editor__error">{errors.title}</div>}
            </div>
            
            <div className="game-editor__field">
              <label htmlFor="slug" className="game-editor__label">Slug</label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className={`game-editor__input ${errors.slug ? 'is-invalid' : ''}`}
                disabled={isEditMode} // Can't change slug in edit mode
              />
              {errors.slug && <div className="game-editor__error">{errors.slug}</div>}
              <div className="game-editor__help">
                URL-friendly name used in the game's URL.
              </div>
            </div>
            
            <div className="game-editor__field">
              <label htmlFor="description" className="game-editor__label">Short Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`game-editor__textarea ${errors.description ? 'is-invalid' : ''}`}
                rows={2}
              ></textarea>
              {errors.description && <div className="game-editor__error">{errors.description}</div>}
              <div className="game-editor__help">
                Brief description shown on game cards (max 150 characters).
              </div>
            </div>
            
            <div className="game-editor__field">
              <label htmlFor="longDescription" className="game-editor__label">Full Description</label>
              <textarea
                id="longDescription"
                name="longDescription"
                value={formData.longDescription}
                onChange={handleChange}
                className="game-editor__textarea"
                rows={6}
              ></textarea>
              <div className="game-editor__help">
                Detailed description shown on the game's detail page.
              </div>
            </div>
          </section>
          
          {/* Category and Tags Section */}
          <section className="game-editor__section">
            <h2 className="game-editor__section-title">Category & Tags</h2>
            
            <div className="game-editor__field">
              <label htmlFor="category" className="game-editor__label">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`game-editor__select ${errors.category ? 'is-invalid' : ''}`}
              >
                <option value="">Select a category</option>
                {availableCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && <div className="game-editor__error">{errors.category}</div>}
            </div>
            
            <div className="game-editor__field">
              <label htmlFor="tags" className="game-editor__label">Tags</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="game-editor__input"
                placeholder="retro, pixel-art, puzzle"
              />
              <div className="game-editor__help">
                Comma-separated list of tags.
              </div>
            </div>
          </section>
          
          {/* Creator Section */}
          <section className="game-editor__section">
            <h2 className="game-editor__section-title">Creator Information</h2>
            
            <div className="game-editor__field">
              <label htmlFor="creatorName" className="game-editor__label">Creator Name</label>
              <input
                type="text"
                id="creatorName"
                name="creatorName"
                value={formData.creatorName}
                onChange={handleChange}
                className={`game-editor__input ${errors.creatorName ? 'is-invalid' : ''}`}
              />
              {errors.creatorName && <div className="game-editor__error">{errors.creatorName}</div>}
            </div>
            
            <div className="game-editor__field">
              <label htmlFor="creatorWebsite" className="game-editor__label">Creator Website</label>
              <input
                type="url"
                id="creatorWebsite"
                name="creatorWebsite"
                value={formData.creatorWebsite}
                onChange={handleChange}
                className="game-editor__input"
                placeholder="https://example.com"
              />
            </div>
          </section>
          
          {/* Controls Section */}
          <section className="game-editor__section">
            <h2 className="game-editor__section-title">Game Controls</h2>
            <div className="game-editor__controls-list">
              {Object.entries(formData.controls).map(([key, value], index) => (
                <div key={index} className="game-editor__control-group">
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => {
                      const newKey = e.target.value;
                      const newControls = Object.entries(formData.controls).reduce((acc, [k, v]) => {
                        if (k === key) {
                          acc[newKey] = v;
                        } else {
                          acc[k] = v;
                        }
                        return acc;
                      }, {});
                      
                      setFormData(prev => ({
                        ...prev,
                        controls: newControls
                      }));
                    }}
                    className="game-editor__input game-editor__input--control-key"
                    placeholder="Key"
                  />
                  <span className="game-editor__control-separator">:</span>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleControlChange(key, e.target.value)}
                    className="game-editor__input game-editor__input--control-action"
                    placeholder="Action"
                  />
                  <button
                    type="button"
                    onClick={() => removeControlField(key)}
                    className="game-editor__control-remove"
                  >
                    &times;
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addControlField}
                className="game-editor__add-control"
              >
                Add Control
              </button>
            </div>
          </section>
          
          {/* Media Section */}
          <section className="game-editor__section">
            <h2 className="game-editor__section-title">Game Media</h2>
            
            <div className="game-editor__field">
              <label className="game-editor__label">Thumbnail</label>
              <div className="game-editor__thumbnail-container">
                {gameThumbnail && (
                  <div className="game-editor__thumbnail-preview">
                    <img 
                      src={gameThumbnail} 
                      alt="Game thumbnail preview" 
                      className="game-editor__thumbnail-image"
                    />
                    <button 
                      type="button" 
                      className="game-editor__thumbnail-remove"
                      onClick={() => setGameThumbnail(null)}
                    >
                      Remove
                    </button>
                  </div>
                )}
                
                <div className="game-editor__thumbnail-upload">
                  <input
                    type="file"
                    id="thumbnail"
                    name="thumbnail"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className={`game-editor__file-input ${errors.thumbnail ? 'is-invalid' : ''}`}
                  />
                  <label htmlFor="thumbnail" className="game-editor__file-label">
                    {gameThumbnail ? 'Change Thumbnail' : 'Upload Thumbnail'}
                  </label>
                  {errors.thumbnail && <div className="game-editor__error">{errors.thumbnail}</div>}
                </div>
              </div>
              <div className="game-editor__help">
                Main image shown on game cards (recommended: 350x200px).
              </div>
            </div>
            
            <div className="game-editor__field">
              <label className="game-editor__label">Screenshots</label>
              <div className="game-editor__screenshots-container">
                {gameScreenshots.length > 0 && (
                  <div className="game-editor__screenshots-grid">
                    {gameScreenshots.map((screenshot, index) => (
                      <div key={index} className="game-editor__screenshot-item">
                        <img 
                          src={screenshot} 
                          alt={`Screenshot ${index + 1}`} 
                          className="game-editor__screenshot-image"
                        />
                        <button 
                          type="button" 
                          className="game-editor__screenshot-remove"
                          onClick={() => removeScreenshot(index)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="game-editor__screenshots-upload">
                  <input
                    type="file"
                    id="screenshots"
                    name="screenshots"
                    accept="image/*"
                    multiple
                    onChange={handleScreenshotsUpload}
                    className="game-editor__file-input"
                  />
                  <label htmlFor="screenshots" className="game-editor__file-label">
                    Add Screenshots
                  </label>
                </div>
              </div>
              <div className="game-editor__help">
                Game screenshots shown on the detail page (recommended: 800x450px).
              </div>
            </div>
          </section>
          
          {/* Game Files Section */}
          <section className="game-editor__section">
            <h2 className="game-editor__section-title">Game Files</h2>
            
            <div className="game-editor__field">
              <label className="game-editor__label">Game Files</label>
              <div className="game-editor__files-container">
                {gameFiles && (
                  <div className="game-editor__files-info">
                    <div className="game-editor__files-count">
                      {gameFiles.length} {gameFiles.length === 1 ? 'file' : 'files'} selected
                    </div>
                    <button 
                      type="button" 
                      className="game-editor__files-remove"
                      onClick={() => setGameFiles(null)}
                    >
                      Remove
                    </button>
                  </div>
                )}
                
                <div className="game-editor__files-upload">
                  <input
                    type="file"
                    id="gameFiles"
                    name="gameFiles"
                    accept=".js,.jsx,.html,.css,image/*,audio/*"
                    multiple
                    onChange={handleGameFilesUpload}
                    className={`game-editor__file-input ${errors.gameFiles ? 'is-invalid' : ''}`}
                  />
                  <label htmlFor="gameFiles" className="game-editor__file-label">
                    {gameFiles ? 'Change Game Files' : 'Upload Game Files'}
                  </label>
                  {errors.gameFiles && <div className="game-editor__error">{errors.gameFiles}</div>}
                </div>
              </div>
              <div className="game-editor__help">
                Upload all game files including the main JavaScript/React file and any assets.
              </div>
            </div>
          </section>
        </div>
        
        <div className="game-editor__actions">
          <button 
            type="button" 
            className="game-editor__button game-editor__button--cancel"
            onClick={() => navigate('/admin/games')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="game-editor__button game-editor__button--save"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : isEditMode ? 'Update Game' : 'Add Game'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GameEditor;