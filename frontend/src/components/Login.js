import React, { useState } from 'react';
import axios from 'axios';
import { getCurrentUser } from './api/AxiosGetCurrentUser'; // Đường dẫn tới file chứa hàm getCurrentUser

function Login({ onClose, onR }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/auth/login', {
        username: username,
        password: password,
      });

      localStorage.setItem('access_token', response.data.access_token);

      const currentUser = await getCurrentUser();
      localStorage.setItem('current_user', JSON.stringify(currentUser));

      setMessage('Đăng nhập thành công!');

      if (typeof onClose === 'function') {
        onClose();
      }
      window.location.href = '/';
    } catch (error) {
      if (error.response) {
        if (error.response.data.message === 'Your account is not activated, please contact admin for more detail. email: tieng062033@gmail.com') {
          setMessage('Tài khoản của bạn chưa được kích hoạt. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.');
        } else {
          setMessage('Tài Khoản Hoặc Mật Khẩu Không Chính Xác.');
        }
      } else {
        setMessage('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      }
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-end">
        {/* Thêm một phần tử trống để thay thế cho dấu X */}
        <div style={{ width: '25px', height: '25px', marginRight: '-15px', marginTop: '-15px' }}></div>
      </div>
      <div className="mt-4">
        <h2>Đăng Nhập</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-3">
            <label htmlFor="username" className="form-label">User Name:</label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password:</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <button type="submit" className="btn btn-primary btn-block">Đăng Nhập</button>
          </div>
          <div className="mb-3">
            <p className="mb-0">Hoặc</p>
            <a href="Register" onClick={onR}>Đăng Ký Mới</a>
          </div>
          {message && <div className="alert alert-danger" role="alert">{message}</div>}
        </form>
      </div>
    </div>
  );
}

export default Login;
