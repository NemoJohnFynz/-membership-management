import axios from 'axios';

// Hàm để gọi API endpoint /users/:username trên backend
const getUserByUsername = async () => {
  const profile = localStorage.getItem('current_user');
    if (!profile) {
      // Không có thông tin người dùng
      // setLoading(false);
      return;
    }
  const token = localStorage.getItem('access_token');
    if (!token) {
    }
    const parsedProfile = JSON.parse(profile);
  try {
    const response = await axios.get(`http://localhost:4000/auth/${parsedProfile.username}`, {
      headers: {
        'Authorization': `Bearer ${token}` // Thêm header token
      }
    });
    return response.data; // Trả về dữ liệu người dùng từ backend
  } catch (error) {
    throw new Error('Failed to fetch user info from backend'); // Xử lý lỗi nếu có
  }
}

export { getUserByUsername };