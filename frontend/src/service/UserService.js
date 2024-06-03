import axios from 'axios';

const fetchAllUser = async () => {
  try {
    const response = await axios.get('http://localhost:4000/auth/');
    return response.data; // Trả về dữ liệu trực tiếp từ response
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export { fetchAllUser };