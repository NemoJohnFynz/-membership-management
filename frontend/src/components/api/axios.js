import { useState, useEffect } from 'react';
import axios from 'axios';

const useAxiosS = () => {
    const [listUsers, setListUsers] = useState([]);
    const [AcToken, setToken] = useState([]);

    useEffect(() => {
        const fetchProductList = async () => {
            try {
                const token = localStorage.getItem('access_token');
                setToken(token)
                if (!token) {
                  throw new Error('Access token not found');
                }else{
                    const token = localStorage.getItem('access_token');
                    
                }
                const response = await axios.get('http://localhost:4000/auth/', {
                    
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });
                if (response.data) {
                    setListUsers(response.data);
                } else {
                    alert('No data found');
                }
            
                // Lưu thông tin người dùng vào localStorage
              } catch (error) {
                console.error('undefine Access Token:', error);
                throw error;
              }
        };

        fetchProductList();
    }, []); // Added urlParams to dependency array

    return { listUsers, AcToken, setListUsers, setToken };
};

export default useAxiosS;
