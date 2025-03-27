import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Button from '../../components/common/Button/Button';

/**
 * User registration page component
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useContext(AuthContext);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  // Error and validation states
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState(null);
  
  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/profile');
    return null;
  }
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear specific field error when user changes the input
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Terms agreement validation
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(null);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { username, email, password } = formData;
      const result = await register({ username, email, password });
      
      if (result.success) {
        // Redirect to profile page
        navigate('/profile');
      } else {
        setGeneralError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setGeneralError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="register-page">
      <div className="register-page__container">
        <div className="register-page__content">
          <div className="register-page__form-container">
            <h1 className="register-page__title">Create Account</h1>
            
            {/* General error message */}
            {generalError && (
              <div className="register-page__error">
                {generalError}
              </div>
            )}
            
            {/* Registration form */}
            <form className="register-form" onSubmit={handleSubmit}>
              <div className="register-form__field">
                <label htmlFor="username" className="register-form__label">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`register-form__input ${errors.username ? 'is-invalid' : ''}`}
                  autoComplete="username"
                />
                {errors.username && (
                  <div className="register-form__field-error">{errors.username}</div>
                )}
              </div>
              
              <div className="register-form__field">
                <label htmlFor="email" className="register-form__label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`register-form__input ${errors.email ? 'is-invalid' : ''}`}
                  autoComplete="email"
                />
                {errors.email && (
                  <div className="register-form__field-error">{errors.email}</div>
                )}
              </div>
              
              <div className="register-form__field">
                <label htmlFor="password" className="register-form__label">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`register-form__input ${errors.password ? 'is-invalid' : ''}`}
                  autoComplete="new-password"
                />
                {errors.password && (
                  <div className="register-form__field-error">{errors.password}</div>
                )}
              </div>
              
              <div className="register-form__field">
                <label htmlFor="confirmPassword" className="register-form__label">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`register-form__input ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <div className="register-form__field-error">{errors.confirmPassword}</div>
                )}
              </div>
              
              <div className="register-form__terms">
                <div className="register-form__checkbox-container">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className={`register-form__checkbox ${errors.agreeTerms ? 'is-invalid' : ''}`}
                  />
                  <label htmlFor="agreeTerms" className="register-form__checkbox-label">
                    I agree to the <Link to="/terms" className="register-form__link">Terms and Conditions</Link>
                  </label>
                </div>
                {errors.agreeTerms && (
                  <div className="register-form__field-error">{errors.agreeTerms}</div>
                )}
              </div>
              
              <div className="register-form__submit">
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="large"
                  disabled={isLoading}
                  className="register-form__button"
                >
                  {isLoading ? 'Creating Account...' : 'Register'}
                </Button>
              </div>
            </form>
            
            {/* Login link */}
            <div className="register-page__login">
              <p>Already have an account?</p>
              <Link to="/login" className="register-page__login-link">
                <Button variant="secondary">
                  Login
                </Button>
              </Link>
            </div>
            
            {/* Information message */}
            <div className="register-page__info">
              <p>Join GameForge.js to play, create and share your own retro-style games!</p>
              <ul className="register-page__benefits">
                <li className="register-page__benefit-item">
                  <div className="register-page__benefit-icon">☑</div>
                  <div className="register-page__benefit-text">Save your high scores</div>
                </li>
                <li className="register-page__benefit-item">
                  <div className="register-page__benefit-icon">☑</div>
                  <div className="register-page__benefit-text">Create and publish your games</div>
                </li>
                <li className="register-page__benefit-item">
                  <div className="register-page__benefit-icon">☑</div>
                  <div className="register-page__benefit-text">Join the developer community</div>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Decorative pixel art section */}
          <div className="register-page__decoration">
            <div className="register-page__pixel-art">
              <div className="register-page__pixel-grid"></div>
              <div className="register-page__pixel-art-character"></div>
              <div className="register-page__pixel-art-block"></div>
              <div className="register-page__pixel-art-block register-page__pixel-art-block--tall"></div>
              <div className="register-page__pixel-art-coin"></div>
              <div className="register-page__pixel-art-coin register-page__pixel-art-coin--small"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;