import React, { useState } from 'react';
import './ContactPage.scss';
import Button from '../../components/Button/Button';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Game Submission',
    message: '',
    gameTitle: '',
    gamePlatforms: [],
    gameDescription: '',
    gameWebsite: '',
    gameRepository: '',
    attachments: []
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const updatedPlatforms = [...formData.gamePlatforms];
    
    if (checked) {
      updatedPlatforms.push(value);
    } else {
      const index = updatedPlatforms.indexOf(value);
      if (index > -1) {
        updatedPlatforms.splice(index, 1);
      }
    }
    
    setFormData({ ...formData, gamePlatforms: updatedPlatforms });
  };
  
  const handleFileChange = (e) => {
    setFormData({ ...formData, attachments: e.target.files });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission (replace with actual form submission logic)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      console.log('Form submitted:', formData);
      
      // Reset form after submission
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          subject: 'Game Submission',
          message: '',
          gameTitle: '',
          gamePlatforms: [],
          gameDescription: '',
          gameWebsite: '',
          gameRepository: '',
          attachments: []
        });
      }, 5000);
    }, 1500);
  };
  
  return (
    <div className="contact-page">
      <div className="contact-header">
        <div className="container">
          <h1 className="contact-header__title">Submit Your Game</h1>
          <p className="contact-header__subtitle">
            Got a game to share? We'd love to feature it on our platform!
          </p>
        </div>
      </div>
      
      <div className="container">
        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-info__card">
              <div className="contact-info__icon">
                <i className="fas fa-gamepad"></i>
              </div>
              <h3 className="contact-info__title">Game Submissions</h3>
              <p className="contact-info__text">
                Fill out the form to submit your game for review. We'll get back to you within 3-5 business days.
              </p>
            </div>
            
            <div className="contact-info__card">
              <div className="contact-info__icon">
                <i className="fas fa-envelope"></i>
              </div>
              <h3 className="contact-info__title">General Inquiries</h3>
              <p className="contact-info__text">
                For general questions or feedback, please email us at:
                <a href="mailto:contact@gameforge.js" className="contact-info__link">
                  contact@gameforge.js
                </a>
              </p>
            </div>
            
            <div className="contact-info__card">
              <div className="contact-info__icon">
                <i className="fas fa-handshake"></i>
              </div>
              <h3 className="contact-info__title">Partnership</h3>
              <p className="contact-info__text">
                Interested in partnering with us? Please contact our business team at:
                <a href="mailto:partners@gameforge.js" className="contact-info__link">
                  partners@gameforge.js
                </a>
              </p>
            </div>
            
            <div className="contact-info__social">
              <h3 className="contact-info__social-title">Connect With Us</h3>
              <div className="contact-info__social-links">
                <a href="#" className="contact-info__social-link" aria-label="Discord">
                  <i className="fab fa-discord"></i>
                </a>
                <a href="#" className="contact-info__social-link" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="contact-info__social-link" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="contact-info__social-link" aria-label="Twitch">
                  <i className="fab fa-twitch"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="contact-form-wrapper">
            {submitted ? (
              <div className="contact-success">
                <div className="contact-success__icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h2 className="contact-success__title">Submission Received!</h2>
                <p className="contact-success__text">
                  Thank you for submitting your game. We'll review it and get back to you shortly.
                </p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form__header">
                  <h2 className="contact-form__title">Contact Form</h2>
                  <p className="contact-form__subtitle">
                    Please fill out the form below with your game details
                  </p>
                </div>
                
                <div className="contact-form__group">
                  <label htmlFor="name" className="contact-form__label">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="contact-form__input"
                    required
                  />
                </div>
                
                <div className="contact-form__group">
                  <label htmlFor="email" className="contact-form__label">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="contact-form__input"
                    required
                  />
                </div>
                
                <div className="contact-form__group">
                  <label htmlFor="subject" className="contact-form__label">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="contact-form__select"
                  >
                    <option value="Game Submission">Game Submission</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Support">Support</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                {formData.subject === 'Game Submission' && (
                  <>
                    <div className="contact-form__group">
                      <label htmlFor="gameTitle" className="contact-form__label">
                        Game Title *
                      </label>
                      <input
                        type="text"
                        id="gameTitle"
                        name="gameTitle"
                        value={formData.gameTitle}
                        onChange={handleInputChange}
                        className="contact-form__input"
                        required
                      />
                    </div>
                    
                    <div className="contact-form__group">
                      <label className="contact-form__label">Platforms *</label>
                      <div className="contact-form__checkboxes">
                        <div className="contact-form__checkbox-item">
                          <input
                            type="checkbox"
                            id="canvas"
                            name="gamePlatforms"
                            value="Canvas"
                            checked={formData.gamePlatforms.includes('Canvas')}
                            onChange={handleCheckboxChange}
                            className="contact-form__checkbox"
                          />
                          <label htmlFor="canvas" className="contact-form__checkbox-label">
                            Canvas
                          </label>
                        </div>
                        
                        <div className="contact-form__checkbox-item">
                          <input
                            type="checkbox"
                            id="webgl"
                            name="gamePlatforms"
                            value="WebGL"
                            checked={formData.gamePlatforms.includes('WebGL')}
                            onChange={handleCheckboxChange}
                            className="contact-form__checkbox"
                          />
                          <label htmlFor="webgl" className="contact-form__checkbox-label">
                            WebGL
                          </label>
                        </div>
                        
                        <div className="contact-form__checkbox-item">
                          <input
                            type="checkbox"
                            id="react"
                            name="gamePlatforms"
                            value="React"
                            checked={formData.gamePlatforms.includes('React')}
                            onChange={handleCheckboxChange}
                            className="contact-form__checkbox"
                          />
                          <label htmlFor="react" className="contact-form__checkbox-label">
                            React
                          </label>
                        </div>
                        
                        <div className="contact-form__checkbox-item">
                          <input
                            type="checkbox"
                            id="phaser"
                            name="gamePlatforms"
                            value="Phaser"
                            checked={formData.gamePlatforms.includes('Phaser')}
                            onChange={handleCheckboxChange}
                            className="contact-form__checkbox"
                          />
                          <label htmlFor="phaser" className="contact-form__checkbox-label">
                            Phaser
                          </label>
                        </div>
                        
                        <div className="contact-form__checkbox-item">
                          <input
                            type="checkbox"
                            id="p5js"
                            name="gamePlatforms"
                            value="p5.js"
                            checked={formData.gamePlatforms.includes('p5.js')}
                            onChange={handleCheckboxChange}
                            className="contact-form__checkbox"
                          />
                          <label htmlFor="p5js" className="contact-form__checkbox-label">
                            p5.js
                          </label>
                        </div>
                        
                        <div className="contact-form__checkbox-item">
                          <input
                            type="checkbox"
                            id="threejs"
                            name="gamePlatforms"
                            value="Three.js"
                            checked={formData.gamePlatforms.includes('Three.js')}
                            onChange={handleCheckboxChange}
                            className="contact-form__checkbox"
                          />
                          <label htmlFor="threejs" className="contact-form__checkbox-label">
                            Three.js
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="contact-form__group">
                      <label htmlFor="gameDescription" className="contact-form__label">
                        Game Description *
                      </label>
                      <textarea
                        id="gameDescription"
                        name="gameDescription"
                        value={formData.gameDescription}
                        onChange={handleInputChange}
                        className="contact-form__textarea"
                        rows="4"
                        required
                      ></textarea>
                    </div>
                    
                    <div className="contact-form__group">
                      <label htmlFor="gameWebsite" className="contact-form__label">
                        Game Website or Deployment Link
                      </label>
                      <input
                        type="url"
                        id="gameWebsite"
                        name="gameWebsite"
                        value={formData.gameWebsite}
                        onChange={handleInputChange}
                        className="contact-form__input"
                        placeholder="https://"
                      />
                    </div>
                    
                    <div className="contact-form__group">
                      <label htmlFor="gameRepository" className="contact-form__label">
                        Game Repository URL (GitHub, GitLab, etc.)
                      </label>
                      <input
                        type="url"
                        id="gameRepository"
                        name="gameRepository"
                        value={formData.gameRepository || ''}
                        onChange={handleInputChange}
                        className="contact-form__input"
                        placeholder="https://github.com/yourusername/your-game"
                      />
                    </div>
                    
                    <div className="contact-form__group">
                      <label className="contact-form__label">
                        Screenshots or Promotional Material
                      </label>
                      <div className="contact-form__file-upload">
                        <input
                          type="file"
                          id="attachments"
                          name="attachments"
                          onChange={handleFileChange}
                          className="contact-form__file"
                          multiple
                          accept="image/*,.pdf"
                        />
                        <label htmlFor="attachments" className="contact-form__file-label">
                          <i className="fas fa-cloud-upload-alt"></i>
                          <span>Choose files</span>
                        </label>
                        <span className="contact-form__file-info">
                          Max 5 files, 5MB each (PNG, JPG, PDF)
                        </span>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="contact-form__group">
                  <label htmlFor="message" className="contact-form__label">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="contact-form__textarea"
                    rows="4"
                    required
                  ></textarea>
                </div>
                
                <div className="contact-form__submit">
                  <Button
                    type="primary"
                    size="large"
                    disabled={isSubmitting}
                    fullWidth={true}
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Submitting...
                      </>
                    ) : (
                      <>
                        Submit <i className="fas fa-paper-plane"></i>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      
      <div className="contact-map">
        <div className="contact-map__overlay">
          <div className="contact-map__card">
            <h3 className="contact-map__title">Our Location</h3>
            <address className="contact-map__address">
              <p>GameForge.js Studios</p>
              <p>123 JavaScript Street</p>
              <p>San Francisco, CA 94107</p>
            </address>
          </div>
        </div>
        <div className="contact-map__placeholder">
          {/* Replace with an actual map integration */}
          <div className="contact-map__image-placeholder">
            <i className="fas fa-map-marked-alt"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;