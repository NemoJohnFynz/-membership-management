import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EvaluateForm = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [selectedCriteria, setSelectedCriteria] = useState({});
  const token = localStorage.getItem('access_token');
  const profile = localStorage.getItem('current_user');
  const parsedProfile = JSON.parse(profile);
  const username = parsedProfile.username;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/evaluate/getEva', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setEvaluations(response.data);
      } catch (error) {
        console.error('Error fetching evaluations:', error);
      }
    };
    fetchData();
  }, [token]);

  const handleChange = async (e) => {
    const selectedId = e.target.value;
    try {
      const response = await axios.get(`http://localhost:4000/evaluate/getByIdevaluate/${selectedId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      const isCompletedByCurrentUser = response.data.completedBy.includes(username);
  
      if (!isCompletedByCurrentUser) {
        setSelectedEvaluation(response.data);
        setSelectedCriteria({});
      } else {
        console.log('This evaluation has already been completed by the current user.');
      }
    } catch (error) {
      console.error('Error fetching selected evaluation:', error);
    }
  };

  const filterEvaluations = () => {
    // Lọc danh sách các bảng đánh giá không được hoàn thành bởi người dùng hiện tại
    return evaluations.filter(evaluation => !evaluation.completedBy.includes(username));
  };

  const handleCriteriaChange = (criteriaId, point) => {
    setSelectedCriteria(prevState => ({
      ...prevState,
      [criteriaId]: {
        _id: criteriaId,
        criteria: selectedEvaluation.criteria.find(criteria => criteria._id === criteriaId).criteria,
        points: parseInt(point)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEvaluation || Object.keys(selectedCriteria).length === 0) {
      console.error('Please select an evaluation and at least one criterion');
      return;
    }

    const idEvaluate = selectedEvaluation._id;
    const criteriaData = Object.values(selectedCriteria).map(criteria => ({
      _id: criteria._id,
      criteria: criteria.criteria,
      points: criteria.points
    }));

    const postData = {
      idEvaluate: idEvaluate,
      username: username,
      criteria: criteriaData
    };

    try {
      const checkResponse = await axios.get(
        `http://localhost:4000/evaluate/Evaluate/${idEvaluate}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const responseData = checkResponse.data;

      if (checkResponse.status !== 200) {
        console.error('Error checking evaluation status:', responseData);
        return;
      }

      const isEvaluatedByCurrentUser = responseData.completedBy.includes(username);

      if (isEvaluatedByCurrentUser) {
        window.alert('You have already evaluated this.');
        return;
      }

      const response = await axios.post(
        `http://localhost:4000/evaluate/userEvaluate/${idEvaluate}`,
        postData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log(response.data);
    } catch (error) {
      console.error('Error submitting evaluation:', error);
    }
  };


  return (
    <div className="container mt-4">
      <select className="form-select mb-3" onChange={handleChange}>
        <option>Select an evaluation</option>
        {filterEvaluations().map((evaluation) => (
          (evaluation._id) && (
            <option key={evaluation._id} value={evaluation._id}>
              {evaluation.title}
            </option>
          )
        ))}
      </select>

      {selectedEvaluation && (
        <div className="card">
          <div className="card-body">
            <h2 className="card-title">{selectedEvaluation.title}</h2>
            <p className="card-text">Expires At: {selectedEvaluation.expiresAt}</p>
            {selectedEvaluation.criteria.map((criteria, index) => (
              <div key={index} className="mb-3">
                <label htmlFor={`criteria-${index}`}>{criteria.criteria}</label>
                <input
                    className="form-control"
                    type="number"
                    id={`criteria-${index}`}
                    name={`criteria-${index}`}
                    value={selectedCriteria[criteria._id]?.points || ''}
                    min={0}
                    max={10}
                    onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 0 && value <= 10) {
                            handleCriteriaChange(criteria._id, value);
                        } else {
                            console.log('Invalid value. Please enter a number between 0 and 10.');
                        }
                    }}
                  />
              </div>
            ))}
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default EvaluateForm;
