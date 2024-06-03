import React from 'react';
import './App.scss';
import Header from './components/Header';
import Home from './components/Home';
import TableUsers from './components/TableUsers';
import Container from 'react-bootstrap/Container';
import { Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Logout from './components/Logout';
import UserProfile from './components/user/UserProfile';
import ChangePassword from './components/user/changpassword';
import UpdateUser from './components/user/UpdateUser';
import CreateEvaluate from './components/admin/evaluate';
import AvatarUploader from './components/user/updateAvatar';
import EvaluateForm from './components/user/UserEva';
import UserEva from './components/admin/UserEva';
import EvaluationDetails from './components/admin/userEvaDetail';


function App() {


  return (
    
      <div className="app-container">
        <Header />
        <Container>
          
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/TableUsers" element={<TableUsers />} />
                <Route path="/UserProfile" element={<UserProfile />} />
                <Route path="/Logout" element={<Logout />} />
                <Route path="/UpdateUser" element={<UpdateUser />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/CreateEvaluate" element={<CreateEvaluate />} />
                <Route path="/AvatarUploader" element={<AvatarUploader />} />
                <Route path="/UserEva" element={<UserEva />} />
                <Route path="/EvaluateForm" element={<EvaluateForm/>} />
                <Route path="/Login" element={<Login />} />
                <Route path="/userEvaluate/:id" element={<EvaluationDetails />} />
                <Route path="/ChangePassword" element={<ChangePassword />} />
                </Routes>
            
        </Container>
      </div>
    
  );
}

export default App;
