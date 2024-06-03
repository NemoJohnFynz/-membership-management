
import axios from 'axios';

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('access_token');

    if (!token) {
      throw new Error('Access token not found');
    }

    const response = await axios.post('http://localhost:4000/auth/current-user', null, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // Lưu thông tin người dùng vào localStorage
    localStorage.setItem('current_user', JSON.stringify(response.data));

    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};