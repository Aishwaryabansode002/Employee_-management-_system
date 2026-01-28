import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/employees/${id}`)
      .then(res => {
        setEmployee(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!employee) return <p className="text-center mt-5">Employee not found</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Employee Details</h2>

      <div className="card shadow">
        <div className="card-body">
          <p><strong>Name:</strong> {employee.fullName}</p>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Phone:</strong> {employee.phoneNumber}</p>
          <p><strong>Department:</strong> {employee.department}</p>
          <p><strong>Designation:</strong> {employee.designation}</p>
          <p><strong>Status:</strong> {employee.employmentStatus}</p>
        </div>
      </div>

      <div className="mt-3">
        <button
          className="btn btn-secondary me-2"
          onClick={() => navigate('/employees')}
        >
          Back
        </button>

        <button
          className="btn btn-warning me-2"
          onClick={() => navigate(`/edit-employee/${employee._id}`)}
        >
          Edit
        </button>

        <button
          className="btn btn-info"
          onClick={() => navigate(`/employee/${employee._id}/history`)}
        >
          View History
        </button>
      </div>
    </div>
  );
};

export default EmployeeDetails;
