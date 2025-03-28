import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../contexts/Auth';
import { useMessage } from '../contexts/MessageContext';

/**
 * A component that protects routes based on authentication and role requirements
 * 
 * @param {Object} props
 * @param {string|string[]} [props.requiredRole] - Required role(s) to access the route
 * @param {string} [props.redirectPath] - Path to redirect to if unauthorized
 */
const ProtectedRoute = ({ 
  requiredRole,
  redirectPath = '/login'
}) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { addMessage } = useMessage();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    addMessage('Please log in to access this page', 'error');
    return <Navigate to={redirectPath} replace />;
  }
  
  // If role is required, check if user has the required role
  if (requiredRole) {
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    if (!user.role || !requiredRoles.includes(user.role)) {
      // User doesn't have the required role
      addMessage('You do not have permission to access this page', 'error');
      return <Navigate to="/" replace />;
    }
  }
  
  // User is authenticated and has required role (if specified)
  return <Outlet />;
};

export default ProtectedRoute;