import { useEffect, useContext } from 'react';
import axios from 'axios';
import { serverUrl } from '../Constants/main';
import AuthContext from '../contexts/Auth';
import { useMessage } from '../contexts/MessageContext';
import { useNavigate } from 'react-router-dom';

export default function useLogout() {
    const { setUser } = useContext(AuthContext);
    const { addMessage } = useMessage();
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            try {
                // Make POST request to logout endpoint
                await axios.post(serverUrl + 'logout', {}, { withCredentials: true });
                
                // Clear user data in context immediately
                setUser(null);
                
                // Show success message
                addMessage('You have been logged out successfully', 'success');
                
                // Redirect to home page
                navigate('/');
            } catch (error) {
                console.error('Logout error:', error);
                addMessage('Error during logout', 'error');
                
                // Still redirect to home page even if there's an error
                navigate('/');
            }
        };
        
        performLogout();
    }, [setUser, addMessage, navigate]);

    return null;
}