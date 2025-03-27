import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Button from '../../components/common/Button/Button';
import Loader from '../../components/common/Loader/Loader';

/**
 * Login page component
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useContext(AuthContext);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  // Error and loading states
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
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
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const { email, password } = formData;
      const result = await login(email, password);
      
      if (result.success) {
        // Redirect to profile page or last visited page
        navigate('/profile');
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="login-page">
      <div className="login-page__container">
        <div className="login-page__content">
          <div className="login-page__form-container">
            <h1 className="login-page__title">Login</h1>
            
            {/* Error message */}
            {error && (
              <div className="login-page__error">
                {error}
              </div>
            )}
            
            {/* Login form */}
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-form__field">
                <label htmlFor="email" className="login-form__label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="login-form__input"
                  required
                  autoComplete="username"
                />
              </div>
              
              <div className="login-form__field">
                <label htmlFor="password" className="login-form__label">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="login-form__input"
                  required
                  autoComplete="current-password"
                />
              </div>
              
              <div className="login-form__options">
                <div className="login-form__remember">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="login-form__checkbox"
                  />
                  <label htmlFor="rememberMe" className="login-form__checkbox-label">
                    Remember me
                  </label>
                </div>
                
                <Link to="/forgot-password" className="login-form__forgot-link">
                  Forgot password?
                </Link>
              </div>
              
              <div className="login-form__submit">
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="large"
                  disabled={isLoading}
                  className="login-form__button"
                >
                  {isLoading ? (
                    <span className="login-form__loader-container">
                      <Loader size="small" /> Logging in...
                    </span>
                  ) : 'Login'}
                </Button>
              </div>
            </form>
            
            {/* Register link */}
            <div className="login-page__register">
              <p>Don't have an account?</p>
              <Link to="/register" className="login-page__register-link">
                <Button variant="secondary">
                  Register
                </Button>
              </Link>
            </div>
            
            {/* Social login options */}
            <div className="login-page__social">
              <div className="login-page__social-divider">
                <span>or login with</span>
              </div>
              
              <div className="login-page__social-buttons">
                <button className="login-page__social-button login-page__social-button--google">
                  G
                </button>
                <button className="login-page__social-button login-page__social-button--github">
                  GH
                </button>
                <button className="login-page__social-button login-page__social-button--discord">
                  D
                </button>
              </div>
            </div>
          </div>
          
          {/* Decorative pixel art section */}
          <div className="login-page__decoration">
            <div className="login-page__pixel-art">
              <div className="login-page__pixel-art-character"></div>
              <div className="login-page__pixel-art-platform"></div>
              <div className="login-page__pixel-art-cloud"></div>
              <div className="login-page__pixel-art-cloud login-page__pixel-art-cloud--small"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;