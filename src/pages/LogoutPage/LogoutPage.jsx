import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';
import Loader from '../../components/Loader/Loader';

const LogoutPage = () => {
  // useLogout hook triggers logout on component mount
  useLogout();
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 70px)' }}>
      <Loader size="large" text="Logging out..." />
    </div>
  );
};

export default LogoutPage;