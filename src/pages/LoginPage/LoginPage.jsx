import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.scss';
import Button from '../../components/Button/Button';
import useLogin from '../../hooks/useLogin';
import AuthContext from '../../contexts/Auth';
import { useMessage } from '../../contexts/MessageContext';

const LoginPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { setLoginData } = useLogin();
  const { addMessage } = useMessage();
  const [formData, setFormData] = useState({
    identifier: '', // This can be username or email
    password: '',
    remember: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirect if already logged in
  useEffect(() => {
    if (user && user.id) {
      navigate('/');
    }
  }, [user, navigate]);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear errors when input changes
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Username or email is required';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate 2-second delay for API call
      setTimeout(async () => {
        try {
          // Send login request
          await setLoginData({
            identifier: formData.identifier,
            password: formData.password,
            remember: formData.remember
          });
          
          // Message is now handled by the hook
          
          // Redirect to home page after successful login
          navigate('/');
        } catch (error) {
          // Error message is handled by the hook
          setIsSubmitting(false);
        }
      }, 2000);
    } catch (error) {
      setIsSubmitting(false);
      addMessage('An unexpected error occurred', 'error');
    }
  };
  
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-header__title">Welcome Back</h1>
          <p className="login-header__subtitle">Log in to continue to GameForge.js</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit} autoComplete="on">
          <div className="login-form__group">
            <label htmlFor="identifier" className="login-form__label">Username or Email</label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleInputChange}
              className={`login-form__input ${errors.identifier ? 'login-form__input--error' : ''}`}
              placeholder="Enter your username or email"
              disabled={isSubmitting}
              autoComplete="username email" // Add both username and email hints
              autoFocus
            />
            {errors.identifier && (
              <div className="login-form__error">{errors.identifier}</div>
            )}
          </div>
          
          <div className="login-form__group">
            <div className="login-form__label-row">
              <label htmlFor="password" className="login-form__label">Password</label>
              <Link to="/forgot-password" className="login-form__forgot">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`login-form__input ${errors.password ? 'login-form__input--error' : ''}`}
              placeholder="Enter your password"
              disabled={isSubmitting}
              autoComplete="current-password" // Specific autocomplete for passwords
            />
            {errors.password && (
              <div className="login-form__error">{errors.password}</div>
            )}
          </div>
          
          <div className="login-form__group login-form__group--checkbox">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              checked={formData.remember}
              onChange={handleInputChange}
              className="login-form__checkbox"
              disabled={isSubmitting}
            />
            <label htmlFor="remember" className="login-form__checkbox-label">
              Remember me
            </label>
          </div>
          
          <div className="login-form__actions">
            <Button
              type="primary"
              size="large"
              fullWidth={true}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="login-form__spinner"></span> Logging in...
                </>
              ) : (
                'Log In'
              )}
            </Button>
          </div>
        </form>
        
        <div className="login-footer">
          <p className="login-footer__text">
            Don't have an account?{' '}
            <Link to="/register" className="login-footer__link">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;