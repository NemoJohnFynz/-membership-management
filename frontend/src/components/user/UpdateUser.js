// UpdateUser.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { updateUser } from '../api/axiosUpdateuser';
import { getUserByUsername } from '../api/ProfileAxios';
import { Modal, Button, Form } from 'react-bootstrap';

const UpdateUser = ({ username }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    born: '',
    address: '',
  });
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    // Fetch user data by username
    const fetchUser = async () => {
      try {
        const userData = await getUserByUsername(username);
        setUser(userData);
        setFormData({
          name: userData.name,
          gender: userData.gender,
          born: userData.born,
          address: userData.address,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error.message);
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(formData);
      setMessage('User updated successfully!');
      setTimeout(() => {
        window.location.reload(); // Refresh trang sau 1 giây
      }, 3000);
      
    } catch (error) {
      console.error('Update user error:', error.message);
      setMessage('Failed to update user. Please try again.');
    }
  };
  
  return (
    <div>
      {/* <h2>Update User</h2> */}
      {/* <Button onClick={() => setShowModal(true)}></Button> */}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Gender:</Form.Label>
              <Form.Control
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Born:</Form.Label>
              <Form.Control
                type="date"
                name="born"
                value={formData.born}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Address:</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <p>{message}</p>
    </div>
  );
};
export default UpdateUser;
