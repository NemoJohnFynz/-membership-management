import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Header = () => {
  const [isTokenExist, setIsTokenExist] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [IsUser, setIsUser] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const profile = localStorage.getItem('current_user');
    const parsedProfile = JSON.parse(profile);
    if (token && token !== '') {
      setIsTokenExist(true);
      setUsername(parsedProfile.username); // Set username
      axios.get(`http://localhost:4000/auth/${parsedProfile.username}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        const { role } = response.data;
        setIsAdmin(role === 0);
        setIsUser(role ===1 );
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
      });
    } else {
      setIsTokenExist(false);
    }
  }, []);
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">NEMO CLUB</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {isTokenExist ? (
                <>
                  
                  {isAdmin && (
                    <>
                      <Nav.Link href="TableUsers">Manage Users</Nav.Link>
                      <Nav.Link href="UserEva">Evaluate User</Nav.Link>
                      <Nav.Link href="CreateEvaluate">Create evaluate</Nav.Link>
                      
                      {/* <Nav.Link href="EvaluationApproval">Approve Evaluate</Nav.Link> */}
                    </>
                  )}
                  
                  {IsUser && (
                    <>
                     <Nav.Link href="EvaluateForm">EvaluateForm</Nav.Link>
                    </>
                  )}
                  <NavDropdown title={username} id="basic-nav-dropdown"> {/* Change Profile to Username */}
                    <NavDropdown.Item href="UserProfile">View Profile</NavDropdown.Item>
                    <NavDropdown.Item href="ChangePassword">Change Password</NavDropdown.Item>
                    <NavDropdown.Item href="Logout">Logout</NavDropdown.Item>
                  </NavDropdown>

                

                </>
              ) : (
                <>             
                  <Nav.Link href="Login">Login</Nav.Link>
                  <Nav.Link href="Register">Register</Nav.Link>
                </>
              )}
              
              
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
