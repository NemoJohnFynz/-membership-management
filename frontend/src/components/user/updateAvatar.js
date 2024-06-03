import React, { useState,useEffect } from 'react';
import axios from 'axios';

const AvatarUploader = ({ onUploadSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [showModal, setShowModal] = useState(false); // State để xác định liệu modal có nên hiển thị hay không

    useEffect(() => {
        // Khi component được render, tự động hiển thị modal
        setShowModal(true);
    }, []);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]); // Lấy file được chọn từ sự kiện onChange và lưu vào state selectedFile
        setAvatarUrl(URL.createObjectURL(event.target.files[0])); // Tạo URL cho hình ảnh đã chọn và lưu vào state avatarUrl
    };

    const handleUpload = async () => {
        if (!selectedFile) { // Kiểm tra xem người dùng đã chọn file hay chưa
            setErrorMessage('Please select a file.'); // Nếu không, hiển thị thông báo lỗi
            return;
        }
    
        setUploading(true); // Bắt đầu quá trình tải lên bằng cách đặt uploading thành true
        const formData = new FormData(); // Tạo một FormData object để chứa dữ liệu cần tải lên
        formData.append('avatar', selectedFile); // Thêm file hình ảnh vào FormData object với key là 'avatar'
    
        const token = localStorage.getItem('access_token');
        const profile = localStorage.getItem('current_user');
        if (!profile) {
            setErrorMessage('Error: No user information found. Please try again later.');
            return;
        }
        const parsedProfile = JSON.parse(profile);
    
        try {
    const response = await axios.post(`http://localhost:4000/auth/avata/${parsedProfile.username}`, formData, { // Gửi yêu cầu POST đến endpoint để tải lên hình ảnh
        headers: {
            'Authorization': `Bearer ${token}`, // Header chứa token để xác thực
            'Content-Type': 'multipart/form-data', // Header chỉ định loại dữ liệu là multipart/form-data
        }
    });
    const { fileUrl } = response.data; // Lấy URL của file hình ảnh tải lên từ phản hồi của server

    setAvatarUrl(fileUrl); // Cập nhật state avatarUrl với URL của hình ảnh mới

    onUploadSuccess(fileUrl); // Gọi hàm onUploadSuccess và truyền URL của hình ảnh mới
    
    alert('Avatar uploaded successfully!'); // Hiển thị thông báo thành công

} catch (error) {
    console.error('Error uploading avatar:', error); // Nếu có lỗi, hiển thị thông báo lỗi trong console
    setErrorMessage('upload successfully'); // Đặt thông báo lỗi
    window.location.reload(); // Làm mới trang để cập nhật trạng thái
} finally {
    setUploading(false); // Đặt uploading thành false để kết thúc quá trình tải lên
}
    };
    

    return (
        <div className="container mt-4">
            {/* Button để mở modal */}
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>Update new avatar</button>
            
            {/* Modal */}
            {showModal && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Upload Avatar</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input className="form-control mb-3" type="file" onChange={handleFileChange} />
                                {avatarUrl && <img src={avatarUrl} alt="Avatar" style={{ maxWidth: '200px' }} />}
                                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                                {successMessage && <p className="text-success">{successMessage}</p>}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleUpload} disabled={uploading}>Upload</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AvatarUploader;
