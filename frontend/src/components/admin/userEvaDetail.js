import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Table } from 'react-bootstrap';

const EvaluationDetails = () => {
    const { id } = useParams();
    const [evaluation, setEvaluation] = useState(null);
    const [AcToken, setToken] = useState('');

    useEffect(() => {
        const fetchEvaluation = async () => {
            try {
                const token = localStorage.getItem('access_token');
                setToken(token);
                if (!token) {
                    throw new Error('Access token not found');
                }
                const response = await axios.get(`http://localhost:4000/evaluate/userEvaluate/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setEvaluation(response.data);
            } catch (error) {
                console.error('Error fetching evaluation details:', error);
            }
        };

        fetchEvaluation();
    }, [id]);

    if (!evaluation) {
        return <div>Loading...</div>;
    }
    const evaluationStatus = evaluation.result ? 'Đã phê duyệt' : 'Đã từ chối';
    return (
        <Container>
        <h2 className="my-4">Chi tiết đánh giá</h2>
        <div>
            <p><strong>Username:</strong> {evaluation.username}</p>
            <p><strong>Trạng thái:</strong> {evaluationStatus}</p>
        </div>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Tiêu chí</th>
                    <th>Điểm</th>
                </tr>
            </thead>
            <tbody>
                {evaluation.criteria.map((criterion, index) => (
                    <tr key={index}>
                        <td>{criterion.criteria}</td>
                        <td>{criterion.points}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    </Container>
    );
};

export default EvaluationDetails;
