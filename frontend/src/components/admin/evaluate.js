import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import { Form, InputGroup, Col, Row, Button } from 'react-bootstrap';

const CreateEvaluationForm = () => {
  const { register, control, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      title: '',
      criteria: [{ criteria: [''], points: 0 }],
      totalPoints: 0,
      expiresAt: ''
    }
  });
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "criteria"
  });

  useEffect(() => {
    let sum = 0;
    fields.forEach((field) => {
      sum += field.points || 0;
    });
    setTotalPoints(sum);
    setValue('totalPoints', sum);
  }, [fields, setValue]);

  const onSubmit = async (data) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.post('http://localhost:4000/evaluate/create-evaluate', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      window.alert('Evaluation created successfully!');
      setSuccessMessage('Evaluation created successfully!');
      setErrorMessage(null);
    } catch (error) {
      console.error(error.response?.data || error.message);
      window.alert('Failed to create evaluation. Please try again.');
      setErrorMessage('Failed to create evaluation. Please try again.');
      setSuccessMessage(null);
    }
  };

    const handlePointsChange = (event, groupIndex) => {
      const newPoints = parseFloat(event.target.value) || 0;
      const updatedFields = fields.map((field, index) => {
        if (index === groupIndex) {
          return { ...field, points: newPoints };
        }
        return field;
      });

      let sum = 0;
      updatedFields.forEach((field) => {
        sum += field.points || 0;
      });
      setTotalPoints(sum);
      setValue('totalPoints', sum);
      update(groupIndex, updatedFields[groupIndex]);
    };

  const addCriteriaGroup = () => {
    append({
      criteria: [''],
      points: 0
    });
  };

  const addCriteria = (index) => {
    const newCriteria = [...fields[index].criteria, ''];
    update(index, { ...fields[index], criteria: newCriteria });
  };

  const removeCriteriaGroup = (index) => {
    remove(index);
  };

  const removeCriteria = (groupIndex, criteriaIndex) => {
    const updatedCriteria = fields[groupIndex].criteria.filter((_, i) => i !== criteriaIndex);
    update(groupIndex, { ...fields[groupIndex], criteria: updatedCriteria });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">Title:</Form.Label>
        <Col sm="10">
          <Form.Control type="text" {...register('title', { required: true })} />
          {errors.title && <Form.Text className="text-danger">This field is required</Form.Text>}
        </Col>
      </Form.Group>

      {fields.map((field, groupIndex) => (
        <div key={field.id}>
          {field.criteria.map((_, criteriaIndex) => (
            <Form.Group as={Row} className="mb-3" key={criteriaIndex}>
              <Form.Label column sm="2">Criteria {criteriaIndex + 1}:</Form.Label>
              <Col sm="8">
                <Form.Control type="text" {...register(`criteria.${groupIndex}.criteria.${criteriaIndex}`, { required: true })} />
                {errors.criteria?.[groupIndex]?.criteria?.[criteriaIndex] && <Form.Text className="text-danger">This field is required</Form.Text>}
              </Col>
              
            </Form.Group>
          ))}
         <Form.Group as={Row} className="mb-3">
  <Form.Label column sm="2">Points:</Form.Label>
  <Col sm="10">
    <Form.Control 
      type="number" 
      defaultValue={field.points} 
      onChange={(e) => handlePointsChange(e, groupIndex)}
      {...register(`criteria.${groupIndex}.points`, { 
        required: true, 
        valueAsNumber: true, 
        min: 0, 
        max: 10 
      })}
      min={0}
      max={10}
    />
    {errors.criteria?.[groupIndex]?.points?.type === 'required' && (
      <Form.Text className="text-danger">This field is required</Form.Text>
    )}
    {errors.criteria?.[groupIndex]?.points?.type === 'min' && (
      <Form.Text className="text-danger">Points must be at least </Form.Text>
    )}
    {errors.criteria?.[groupIndex]?.points?.type === 'max' && (
      <Form.Text className="text-danger">Points must be at most 10</Form.Text>
    )}
  </Col>
</Form.Group>
          {/* <Button variant="secondary" type="button" onClick={() => addCriteria(groupIndex)}>Add More Criteria</Button> */}
          <Button variant="danger" type="button" onClick={() => removeCriteriaGroup(groupIndex)}>Remove Criteria Group</Button>
        </div>
      ))}

      <Button variant="warning" type="button" onClick={addCriteriaGroup}>Add Criteria Group</Button>

      {/* <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">Total Points:</Form.Label>
        <Col sm="10">
          <Form.Control type="number" value={totalPoints} readOnly />
        </Col>
      </Form.Group> */}

      {/* <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">Expires At:</Form.Label>
        <Col sm="10">
          <Form.Control type="date" {...register('expiresAt', { required: true })} />
          {errors.expiresAt && <Form.Text className="text-danger">This field is required</Form.Text>}
        </Col>
      </Form.Group> */}

      <Button variant="primary" type="submit">Submit</Button>
    </Form>
  );
};

export default CreateEvaluationForm;
