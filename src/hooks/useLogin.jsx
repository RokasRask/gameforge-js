import { useContext } from 'react';
import axios from 'axios';
import { serverUrl } from '../Constants/main';
import AuthContext from '../contexts/Auth';
import { useMessage } from '../contexts/MessageContext';

export default function useLogin() {
    const { setUser } = useContext(AuthContext);
    const { addMessage } = useMessage();

    const loginUser = async (data) => {
        try {
            // Make POST request to login endpoint
            const response = await axios.post(serverUrl + 'login', data, { 
                withCredentials: true 
            });
            
            // Update user context with returned data
            setUser(response.data.user);
            
            // Show success message
            addMessage(`Hello, ${response.data.user.name}!`, 'success');
            
            // Return the response data
            return response.data;
        } catch (error) {
            // Handle error
            const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
            addMessage(errorMessage, 'error');
            throw error;
        }
    };

    return { setLoginData: loginUser };
}