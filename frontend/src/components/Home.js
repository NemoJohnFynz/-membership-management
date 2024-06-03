// Home.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import useAxiosS from './api/axios'; // Import useAxiosS từ đúng đường dẫn của bạn

const Home = () => {
  const { listUsers } = useAxiosS();
  const [adminUsers, setAdminUsers] = useState([]);
  const [founder, setFounder] = useState(null);

  useEffect(() => {
    const admins = listUsers.filter(user => user.role === 0);
    setAdminUsers(admins);
    const founderAdmin = listUsers.find(user => user.username === 'tongtulenh');
    setFounder(founderAdmin);
  }, [listUsers]);

  return (
    <Container>
      <Row className="my-4">
        <Col>
          <h1>Welcome to Nemo clubs</h1>
          {founder && (
            <Card className="mb-4 text-center">
              <Card.Img 
                variant="top" 
                src={founder.avatar} 
                alt="Founder" 
                style={{ width: '150px', height: '150px', borderRadius: '50%', margin: 'auto', marginTop: '20px' }} 
              />
              <Card.Body>
                <Card.Title>Meet Our Founder: {founder.name}</Card.Title>
                <Card.Text>
                  "Innovating and leading our community towards a brighter future."
                </Card.Text>
              </Card.Body>
            </Card>
          )}
          
        </Col>
      </Row>
      <Row className="my-4">
        {adminUsers.slice(0, 3).map((admin, index) => (
          <Col md={4} key={index}>
            <Card>
              <Card.Img variant="top" src={admin.avatar} alt={`Admin ${index + 1}`} />
              <Card.Body>
                <Card.Title>{admin.name}</Card.Title>
                <Card.Text>
                honorary admin, co-founder with Tổng Tư Lệnh
                </Card.Text>
                
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;
