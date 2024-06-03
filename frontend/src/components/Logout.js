import React from 'react';

const Logout = () => {
  const handleLogout = () => {
    // Xóa token khỏi localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user');
    

    // Chuyển hướng đến trang đăng nhập (ví dụ: '/login')
    window.location.href="/Login" // Cách đơn giản chuyển hướng trang
    // Hoặc sử dụng React Router để chuyển hướng (nếu bạn đang sử dụng React Router)
    // history.push('/login');
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;