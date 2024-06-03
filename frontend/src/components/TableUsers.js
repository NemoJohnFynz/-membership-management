import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert'; // Import Alert
import useAxiosS from './api/axios';
import axios from 'axios';

const TableUsers = () => {
  const { listUsers, setListUsers, AcToken } = useAxiosS(); // Destructure values from custom hook
  const [error, setError] = useState(null); // State to store error message

  // Function to toggle user active status
  const toggleUserActive = async (username) => {
    try {
      // Send PUT request to toggle user active status
      await axios.put(`http://localhost:4000/auth/activated/${username}`, {}, {
        headers: {
          'Authorization': `Bearer ${AcToken}` // Include access token in request header
        }
      });

      // Update user list locally
      setListUsers(prevUsers => prevUsers.map(user => 
        user.username === username ? { ...user, isActive: !user.isActive } : user
      ));
      setError(null); // Clear error if successful
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message); // Set error message from backend
      } else {
        setError('Error toggling user active status'); // Set generic error message
      }
    }
  };
  return (
    <>
      <h2>User List</h2>
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>} {/* Display error message if exists */}
      <Table striped bordered hover >
        <thead>
          <tr>
            <th>Số thứ tự</th>
            <th>Avatar</th>
            <th>Username</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Born</th>
            
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {listUsers.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td style={{ maxWidth: '100px', maxHeight: '100px' }}>
                <img src={user.avatar} alt="avatar" style={{ width: '100%', height: 'auto' }} /></td>
              <td>{user.username}</td>
              <td>{user.name}</td>
              <td>{user.gender}</td>
              <td>{user.born}</td>
              
              <td>
                <Button 
                  variant={user.isActive ? "outline-danger" : "outline-success"} 
                  onClick={() => toggleUserActive(user.username)}
                >
                  {user.isActive ? "unactive" : "active"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default TableUsers;
