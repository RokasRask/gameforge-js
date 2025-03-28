import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';
import Loader from '../../components/Loader/Loader';
import AuthContext from '../../contexts/Auth';

const LogoutPage = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  
  // Use the logout hook
  useLogout();
  
  // Fallback redirect in case the hook's navigation doesn't work
  useEffect(() => {
    // Set a timeout to automatically redirect after 3 seconds
    // This ensures users don't get stuck on the logout page
    const redirectTimeout = setTimeout(() => {
      setUser(null); // Ensure user is cleared
      navigate('/');
    }, 3000);
    
    return () => clearTimeout(redirectTimeout);
  }, [navigate, setUser]);
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: 'calc(100vh - 70px)',
      textAlign: 'center'
    }}>
      <Loader size="large" text="Logging out..." />
      <p style={{ marginTop: '20px', color: 'rgba(255, 255, 255, 0.7)' }}>
        If you're not redirected automatically, click <button 
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: '#7b38ff',
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: 0,
            font: 'inherit'
          }}
        >
          here
        </button>
      </p>
    </div>
  );
};

export default LogoutPage;