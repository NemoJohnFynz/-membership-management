import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const UserEva = () => {
    const [listUsersEva, setListUsersEva] = useState([]);
    const [evaluationTitles, setEvaluationTitles] = useState({});
    const [totalPoints, setTotalPoints] = useState({});
    const [evaluationResults, setEvaluationResults] = useState({});
    const [AcToken, setToken] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false); // Trạng thái chung cho việc kiểm tra khóa nút
    const [id, setId] = useState('');
    const [idEvaluate, setIdEvaluate] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {

        const fetchUserList = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    throw new Error('Không tìm thấy token truy cập');
                } else {
                    setToken(token);
                    const response = await axios.get('http://localhost:4000/evaluate/userEvaluate/', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.data) {
                        const users = response.data;
                        setListUsersEva(users);

                        // Tính tổng điểm từ danh sách người dùng
                        const points = {};
                        for (const user of users) {
                            const totalPointsSum = user.criteria.reduce((sum, criterion) => sum + criterion.points, 0);
                            points[user.idEvaluate] = totalPointsSum;
                        }
                        setTotalPoints(points);
                    } else {
                        alert('Không tìm thấy dữ liệu');
                    }
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách người dùng:', error);
                alert('Lỗi khi lấy danh sách người dùng');
            }
        };

        fetchUserList();
    }, []);


    useEffect(() => {
        const fetchEvaluationDetails = async () => {
            const token = localStorage.getItem('access_token');
            const titles = {};
            const results = {};
            for (const user of listUsersEva) {
                try {
                    const response = await axios.get(`http://localhost:4000/evaluate/Evaluate/${user.idEvaluate}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.data) {
                        titles[user.idEvaluate] = response.data.title;
                    } else {
                        titles[user.idEvaluate] = 'No title found';
                    }
    
                    results[user._id] = user.result;
                } catch (error) {
                    console.error(`Error fetching details for ${user.idEvaluate}:`, error);
                    titles[user.idEvaluate] = 'Error fetching title';
                }
            }
            setEvaluationTitles(titles);
            setEvaluationResults(results);
        };
    
        if (listUsersEva.length > 0) {
            fetchEvaluationDetails();
        }
    }, [listUsersEva]);

    const handleApprove = async (id) => {
        try {
            const response = await axios.patch(`http://localhost:4000/evaluate/${id}/approve`, null, {
                headers: {
                    'Authorization': `Bearer ${AcToken}`
                }
            });
            console.log('Evaluation approved:', response.data);
            setEvaluationResults(prevState => ({ ...prevState, [id]: true }));
            setButtonDisabled(true); // Khóa nút sau khi phê duyệt
        } catch (error) {
            console.error('Error approving evaluation:', error);
        }
    };

    const handleReject = async (idEvaluate, username) => {
        try {
            // Duyệt qua danh sách để tìm idEvaluate tương ứng với _id
            const userEvaluation = listUsersEva.find(user => user._id === idEvaluate);
            const idEvaluateFromList = userEvaluation.idEvaluate;
    
            const response = await axios.put(`http://localhost:4000/evaluate/${idEvaluateFromList}/reject`, { username }, {
                headers: {
                    'Authorization': `Bearer ${AcToken}`
                }
            });
    
            console.log('Evaluation rejected:', response.data);
            setEvaluationResults(prevState => ({ ...prevState, [idEvaluate]: false }));
            setButtonDisabled(true); // Khóa nút sau khi từ chối
        } catch (error) {
            console.error('Error rejecting evaluation:', error);
        }
    };

    const handleViewDetails = (id) => {
        // Thực hiện chuyển hướng người dùng đến trang chi tiết đánh giá của người dùng
        navigate(`/userEvaluate/${id}`);
    };

    return (
        <Container>
            <h2 className="my-4">Danh sách đánh giá người dùng</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên người dùng</th>
                        <th>Tiêu đề</th>
                        <th>Tổng điểm</th>
                        <th>Phê duyệt</th>
                        <th>Từ chối</th>
                        <th>Xem chi tiết</th>
                    </tr>
                </thead>
                <tbody>
                    {listUsersEva.map((user, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{user.username}</td>
                            <td>{evaluationTitles[user.idEvaluate] || 'Đang tải...'}</td>
                            <td>{totalPoints[user.idEvaluate] !== undefined ? totalPoints[user.idEvaluate] : 'Đang tải...'}</td>
                            <td>
                                <Button
                                    variant={evaluationResults[user._id] === true ? "success" : "primary"}
                                    onClick={() => handleApprove(user._id)}
                                    disabled={evaluationResults[user._id] !== undefined} // Khóa nút nếu result đã có giá trị
                                >
                                    {evaluationResults[user._id] === true ? 'Đã phê duyệt' : 'Phê duyệt'} {/* Chỉ thay đổi chữ khi result là true */}
                                </Button>
                            </td>
                            <td>
                                <Button
                                    variant={evaluationResults[user._id] === false ? "danger" : "warning"}
                                    onClick={() => handleReject(user._id, user.username)}
                                    disabled={evaluationResults[user._id] !== undefined} // Khóa nút nếu result đã có giá trị
                                >
                                    {evaluationResults[user._id] === false ? 'Đã từ chối' : 'Từ chối'} {/* Chỉ thay đổi chữ khi result là false */}
                                </Button>
                            </td>
                            <td>
                                <Button variant="info" onClick={() => handleViewDetails(user._id)}>
                                    Xem chi tiết
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default UserEva;
