import axios from 'axios';
import { serverUrl } from '../Constants/main';
import { useMessage } from '../contexts/MessageContext';

export default function useRegister() {
    const { addMessage } = useMessage();

    const registerUser = async (data) => {
        try {
            // Make POST request to register endpoint
            const response = await axios.post(serverUrl + 'register', data, { 
                withCredentials: true 
            });
            
            // Show success message
            if (response.data.success) {
                addMessage('Registration complete!', 'success');
            }
            
            // Return the response data
            return response.data;
        } catch (error) {
            // Handle error
            const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
            addMessage(errorMessage, 'error');
            throw error;
        }
    };

    return { setRegisterData: registerUser };
}