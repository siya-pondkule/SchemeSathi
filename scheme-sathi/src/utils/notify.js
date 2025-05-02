import axios from 'axios';
export const notifyUsersOnNewScheme = async (numbers, message) => {
    try {
      if (!Array.isArray(numbers) || numbers.length === 0) {
        throw new Error('No valid phone numbers provided');
      }
  
      const response = await axios.post('http://localhost:5000/send-sms', {
        numbers,
        message,
      });
  
      return response.data;
    } catch (error) {
      console.error('Failed to send SMS:', error);
      alert('Failed to send SMS: ' + error.message);  // Show user-friendly error
      throw error;
    }
  };
  