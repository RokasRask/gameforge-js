import React, { useState } from 'react';
import Button from '../../components/common/Button/Button';

/**
 * Contact page component
 */
const ContactPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
    isGameSubmission: false
  });
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success response
      console.log('Form submitted:', formData);
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: 'general',
        message: '',
        isGameSubmission: false
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('There was an error submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="contact-page">
      <div className="contact-page__container">
        <div className="contact-page__header">
          <h1 className="contact-page__title">Contact Us</h1>
          <p className="contact-page__subtitle">
            Get in touch with the GameForge.js team or submit your game for review
          </p>
        </div>
        
        {/* Info cards */}
        <div className="contact-page__info">
          <div className="contact-card">
            <div className="contact-card__icon contact-card__icon--questions"></div>
            <h2 className="contact-card__title">General Questions</h2>
            <p className="contact-card__text">
              Have questions about our platform? We're here to help with any inquiries.
            </p>
          </div>
          
          <div className="contact-card">
            <div className="contact-card__icon contact-card__icon--game"></div>
            <h2 className="contact-card__title">Submit Your Game</h2>
            <p className="contact-card__text">
              Created a JavaScript or React game? Submit it to be featured on our platform!
            </p>
          </div>
          
          <div className="contact-card">
            <div className="contact-card__icon contact-card__icon--feedback"></div>
            <h2 className="contact-card__title">Feedback</h2>
            <p className="contact-card__text">
              We value your feedback to improve GameForge.js and make it even better.
            </p>
          </div>
        </div>
        
        {/* Contact form */}
        <div className="contact-page__form-container">
          {submitSuccess ? (
            <div className="contact-page__success">
              <div className="contact-page__success-icon"></div>
              <h2 className="contact-page__success-title">Message Sent!</h2>
              <p className="contact-page__success-message">
                Thank you for contacting us. We'll get back to you as soon as possible.
              </p>
              <Button 
                variant="primary"
                onClick={() => setSubmitSuccess(false)}
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form__grid">
                {/* Name field */}
                <div className="contact-form__field">
                  <label className="contact-form__label" htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="contact-form__input"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                {/* Email field */}
                <div className="contact-form__field">
                  <label className="contact-form__label" htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="contact-form__input"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                {/* Subject field */}
                <div className="contact-form__field contact-form__field--full">
                  <label className="contact-form__label" htmlFor="subject">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    className="contact-form__select"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="general">General Inquiry</option>
                    <option value="game-submission">Game Submission</option>
                    <option value="feedback">Feedback</option>
                    <option value="bug-report">Bug Report</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
                
                {/* Message field */}
                <div className="contact-form__field contact-form__field--full">
                  <label className="contact-form__label" htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    className="contact-form__textarea"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                
                {/* Game submission checkbox */}
                <div className="contact-form__field contact-form__field--checkbox">
                  <input
                    type="checkbox"
                    id="isGameSubmission"
                    name="isGameSubmission"
                    className="contact-form__checkbox"
                    checked={formData.isGameSubmission}
                    onChange={handleChange}
                  />
                  <label className="contact-form__checkbox-label" htmlFor="isGameSubmission">
                    I'm submitting a game for review
                  </label>
                </div>
                
                {/* Submit button */}
                <div className="contact-form__submit">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
                
                {/* Error message */}
                {submitError && (
                  <div className="contact-form__error">
                    {submitError}
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
        
        {/* Additional contact information */}
        <div className="contact-page__info-footer">
          <div className="contact-info">
            <h3 className="contact-info__title">Connect With Us</h3>
            <div className="contact-info__item">
              <span className="contact-info__icon contact-info__icon--email"></span>
              <a href="mailto:hello@gameforgejs.com" className="contact-info__link">
                hello@gameforgejs.com
              </a>
            </div>
            <div className="contact-info__item">
              <span className="contact-info__icon contact-info__icon--discord"></span>
              <a href="https://discord.gg/gameforgejs" className="contact-info__link" target="_blank" rel="noopener noreferrer">
                Join our Discord
              </a>
            </div>
            <div className="contact-info__item">
              <span className="contact-info__icon contact-info__icon--github"></span>
              <a href="https://github.com/gameforgejs" className="contact-info__link" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;