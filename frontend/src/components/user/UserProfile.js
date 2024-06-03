import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserByUsername } from '../api/ProfileAxios';
import AvatarUploader from '../user/updateAvatar'; // Import AvatarUploader
import Button from 'react-bootstrap/Button';
import UpdateUser from '../user/UpdateUser'; // Import UpdateUser component


const styles = `

  .user-profile-box {
    width: 400px; /* Độ rộng của ô vuông */
    height: 50vh; /* Phóng to lên 1/2 màn hình */
    border: 1px solid #ccc; /* Viền */
    border-radius: 10px; /* Độ cong của góc */
    overflow: hidden; /* Ẩn nội dung vượt quá kích thước ô vuông */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Hiệu ứng bóng */
    display: flex; /* Hiển thị flex */
    flex-direction: column; /* Chia thành cột */
    justify-content: center; /* Căn giữa theo chiều dọc */
    align-items: center; /* Căn giữa theo chiều ngang */
  }
  .user-profile {
    display: flex;
    align-items: center;
    padding: 20px;
  }
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-right: 20px;
  }
  .user-info {
    flex: 1; /* Cho phép nội dung mở rộng theo chiều ngang */
  }
  .user-info h2 {
    margin-top: 0;
  }
  .user-info p {
    margin-bottom: 10px;
  }
`;

const UserProfile = () => {
  const [isAvatarUploadOpen, setIsAvatarUploadOpen] = useState(false);
  const [isUpdateUserOpen, setIsUpdateUserOpen] = useState(false); // State variable for UpdateUser component visibility
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from API
    const token = localStorage.getItem('access_token');
    if (!token) {
      // Handle missing token
      return;
    }

    const profile = localStorage.getItem('current_user');
    if (!profile) {
      setLoading(false);
      return;
    }

    const parsedProfile = JSON.parse(profile);

    getUserByUsername(parsedProfile.username, token)
      .then(userData => {
        setUser(userData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user:', error.message);
        setLoading(false);
      });
  }, []);

  const handleOpenAvatarUpload = () => {
    setIsAvatarUploadOpen(true);
  };

  // Function to toggle visibility of UpdateUser component
  const handleToggleUpdateUser = () => {
    setIsUpdateUserOpen(!isUpdateUserOpen);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <div>
      <style jsx>{styles}</style>
      <div className="user-profile-box">
        <div className="user-profile">
          <img className="avatar" src={user.avatar} alt="Avatar" />
          <div className="user-info">
            <p><strong>Full name:</strong> {user.name}</p>
            <p><strong>Gender:</strong> {user.gender}</p>
            <p><strong>Date of Birth:</strong> {user.born}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <Button variant="success" onClick={handleOpenAvatarUpload}>Upload Avatar</Button>
            <Button variant="secondary" onClick={handleToggleUpdateUser}>Update User</Button> {/* Button to toggle UpdateUser component */}
            {isUpdateUserOpen && <UpdateUser username={user.username} />} {/* Render UpdateUser component if isUpdateUserOpen is true */}
            {isAvatarUploadOpen && <AvatarUploader />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;