import axios from 'axios';

// Hàm để gọi API endpoint /users/:username trên backend
const updateUser= async (FormData) => {
    const profile = localStorage.getItem('current_user');
    if (!profile) {
        throw new Error('No user profile found in local storage');
      }
    const token = localStorage.getItem('access_token');
    if (!token) {
      // Không có token, có thể chuyển hướng đến trang đăng nhập
      // hoặc hiển thị thông báo yêu cầu đăng nhập
      // Ví dụ:
      // history.push('/login');
      // return;
    }
    const parsedProfile = JSON.parse(profile);
  try {
    console.log(parsedProfile.username);
    const response = await axios.put(`http://localhost:4000/auth/${parsedProfile.username}`,FormData, {
      headers: {
        'Authorization': `Bearer ${token}` // Thêm header token
      }
    });
    return response.data; // Trả về dữ liệu người dùng từ backend
  } catch (error) {
    throw new Error('Failed to fetch user info from backend'); // Xử lý lỗi nếu có
  }
}

export { updateUser };