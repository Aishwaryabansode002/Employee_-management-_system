import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import EmployeeForm from '../components/EmployeeForm';
import Toast from '../components/Toast';
import employeeService from '../services/employeeService';

/**
 * Edit Employee Page
 * Form to update existing employee records
 */
const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success',
  });

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setFetchLoading(true);
      const response = await employeeService.getEmployeeById(id);
      setEmployee(response.data);
    } catch (error) {
      showToast(
        error.message || 'Failed to load employee data',
        'error'
      );
    } finally {
      setFetchLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, show: false });
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await employeeService.updateEmployee(id, formData);
      showToast('Employee updated successfully!', 'success');
      
      // Redirect to employees list after 1.5 seconds
      setTimeout(() => {
        navigate('/employees');
      }, 1500);
    } catch (error) {
      showToast(
        error.message || 'Failed to update employee. Please try again.',
        'error'
      );
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="container py-5">
        <div className="spinner-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Employee not found
        </div>
        <Link to="/employees" className="btn btn-primary">
          <i className="bi bi-arrow-left me-2"></i>
          Back to Employee List
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col">
          <h2 className="mb-1">
            <i className="bi bi-pencil-square me-2"></i>
            Edit Employee
          </h2>
          <p className="text-muted">
            Update information for <strong>{employee.fullName}</strong> (
            {employee.employeeId})
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-10 mx-auto">
          <div className="card shadow-sm mb-3">
            <div className="card-header">
              <i className="bi bi-file-earmark-text me-2"></i>
              Employee Information
            </div>
            <div className="card-body">
              <div className="alert alert-warning mb-4" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                <strong>Important:</strong> All changes will be tracked in the employee history.
              </div>
              
              <EmployeeForm
                initialData={employee}
                onSubmit={handleSubmit}
                loading={loading}
                mode="edit"
              />
            </div>
          </div>

          <div className="d-flex gap-2 mt-3">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate('/employees')}
              disabled={loading}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Employee List
            </button>
            <Link
              to={`/employee/${id}/history`}
              className="btn btn-outline-info"
            >
              <i className="bi bi-clock-history me-2"></i>
              View History
            </Link>
          </div>
        </div>
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </div>
  );
};

export default EditEmployee;