import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const Username = localStorage.getItem('username');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:4000/auth/changepassword/${Username}`, {
        OldPassword: formData.oldPassword,
        NewPassword: formData.newPassword,
      });
      setMessage('Password changed successfully!');
    } catch (error) {
      console.error('Change password error:', error.message);
      setMessage('Failed to change password. Please try again.');
    }
  };

  return (
    <div className="background d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="mb-4">Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Old Password:</label>
            <input
              type="password"
              name="oldPassword"
              className="form-control"
              value={formData.oldPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>New Password:</label>
            <input
              type="password"
              name="newPassword"
              className="form-control"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Change Password</button>
          {message && <p className="mt-3 text-center">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;


// import React, { useState } from 'react';
// import axios from 'axios';
// import '../../style/changepassword.css'
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

// const ChangePassword = () => {
//   const [formData, setFormData] = useState({
//     oldPassword: '',
//     newPassword: '',
//   });
//   const [message, setMessage] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const Username = localStorage.getItem('username');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`http://localhost:4000/auth/changepassword/${Username}`, {
//         OldPassword: formData.oldPassword,
//         NewPassword: formData.newPassword,
//       });
//       setMessage('Password changed successfully!');
//     } catch (error) {
//       console.error('Change password error:', error.message);
//       setMessage('Failed to change password. Please try again.');
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center min-vh-100">
//       <div className="card p-4" style={{ maxWidth: '400px', width: '100%' }}>
//         <h2 className="mb-4">Change Password</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Old Password:</label>
//             <input
//               type="password"
//               name="oldPassword"
//               className="form-control"
//               value={formData.oldPassword}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label>New Password:</label>
//             <input
//               type="password"
//               name="newPassword"
//               className="form-control"
//               value={formData.newPassword}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <button type="submit" className="btn btn-primary btn-block">Change Password</button>
//           {message && <p className="mt-3 text-center">{message}</p>}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ChangePassword;
