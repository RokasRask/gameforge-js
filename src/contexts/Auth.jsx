import { createContext, useEffect, useState } from 'react';
import { serverUrl } from '../Constants/main';
import axios from 'axios';
import Loader from '../components/Loader/Loader';

const AuthContext = createContext();

export const Auth = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check authentication status on app initialization
        axios.get(serverUrl + 'auth', { withCredentials: true })
            .then(res => {
                setUser(res.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Auth error:', error);
                setLoading(false);
            });
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            isAuthenticated: !!user, // Boolean to easily check if user is authenticated
            isAdmin: user && user.role === 'admin' // Boolean to easily check if user is admin
        }}>
            {loading ? (
                <div className='loader-container'>
                    <Loader size="large" text="Loading..." />
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};

export default AuthContext;