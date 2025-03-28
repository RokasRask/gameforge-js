import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.scss';
import Button from '../../components/Button/Button';
import useRegister from '../../hooks/useRegister';
import AuthContext from '../../contexts/Auth';
import { useMessage } from '../../contexts/MessageContext';

const RegisterPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { setRegisterData } = useRegister();
  const { addMessage } = useMessage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
    marketingOptIn: false
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
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Username is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Username must be at least 3 characters';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Terms acceptance validation
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the Terms and Conditions';
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
          // Send registration request
          await setRegisterData({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            marketingOptIn: formData.marketingOptIn
          });
          
          // Message is handled by the hook
          
          // Redirect to login page after successful registration
          setTimeout(() => {
            navigate('/login');
          }, 500);
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
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1 className="register-header__title">Create an Account</h1>
          <p className="register-header__subtitle">Join GameForge.js to discover and play amazing JavaScript games</p>
        </div>
        
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-form__group">
            <label htmlFor="name" className="register-form__label">Username</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`register-form__input ${errors.name ? 'register-form__input--error' : ''}`}
              placeholder="Choose a username"
              disabled={isSubmitting}
            />
            {errors.name && (
              <div className="register-form__error">{errors.name}</div>
            )}
          </div>
          
          <div className="register-form__group">
            <label htmlFor="email" className="register-form__label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`register-form__input ${errors.email ? 'register-form__input--error' : ''}`}
              placeholder="Enter your email address"
              disabled={isSubmitting}
            />
            {errors.email && (
              <div className="register-form__error">{errors.email}</div>
            )}
          </div>
          
          <div className="register-form__group">
            <label htmlFor="password" className="register-form__label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`register-form__input ${errors.password ? 'register-form__input--error' : ''}`}
              placeholder="Create a password"
              disabled={isSubmitting}
            />
            {errors.password && (
              <div className="register-form__error">{errors.password}</div>
            )}
            <div className="register-form__password-hint">
              Password must be at least 8 characters with one uppercase letter and one number
            </div>
          </div>
          
          <div className="register-form__group">
            <label htmlFor="confirmPassword" className="register-form__label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`register-form__input ${errors.confirmPassword ? 'register-form__input--error' : ''}`}
              placeholder="Confirm your password"
              disabled={isSubmitting}
            />
            {errors.confirmPassword && (
              <div className="register-form__error">{errors.confirmPassword}</div>
            )}
          </div>
          
          <div className="register-form__group register-form__group--checkbox">
            <input
              type="checkbox"
              id="termsAccepted"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleInputChange}
              className="register-form__checkbox"
              disabled={isSubmitting}
            />
            <label htmlFor="termsAccepted" className="register-form__checkbox-label">
              I agree to the <Link to="/terms" className="register-form__link">Terms and Conditions</Link>
            </label>
            {errors.termsAccepted && (
              <div className="register-form__error register-form__error--checkbox">{errors.termsAccepted}</div>
            )}
          </div>
          
          <div className="register-form__group register-form__group--checkbox">
            <input
              type="checkbox"
              id="marketingOptIn"
              name="marketingOptIn"
              checked={formData.marketingOptIn}
              onChange={handleInputChange}
              className="register-form__checkbox"
              disabled={isSubmitting}
            />
            <label htmlFor="marketingOptIn" className="register-form__checkbox-label">
              I want to receive updates about new games and features
            </label>
          </div>
          
          <div className="register-form__actions">
            <Button
              type="primary"
              size="large"
              fullWidth={true}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="register-form__spinner"></span> Registering...
                </>
              ) : (
                'Register'
              )}
            </Button>
          </div>
        </form>
        
        <div className="register-footer">
          <p className="register-footer__text">
            Already have an account?{' '}
            <Link to="/login" className="register-footer__link">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;