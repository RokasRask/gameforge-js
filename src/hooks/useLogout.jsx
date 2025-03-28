import { useEffect, useContext } from 'react';
import axios from 'axios';
import { serverUrl } from '../Constants/main';
import AuthContext from '../contexts/Auth';
import { useMessage } from '../contexts/MessageContext';

export default function useLogout() {
    const { setUser } = useContext(AuthContext);
    const { addMessage } = useMessage();

    useEffect(() => {
        // Make POST request to logout endpoint
        axios.post(serverUrl + 'logout', {}, { withCredentials: true })
            .then(res => {
                // Clear user data in context
                setUser(null);
                
                // Show success message
                addMessage('You have been logged out successfully', 'success');
            })
            .catch(error => {
                console.error('Logout error:', error);
                addMessage('Error during logout', 'error');
            });
    }, [setUser, addMessage]);

    return null;
}