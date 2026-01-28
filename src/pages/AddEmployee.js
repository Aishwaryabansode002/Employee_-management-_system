import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeForm from '../components/EmployeeForm';
import Toast from '../components/Toast';
import employeeService from '../services/employeeService';

/**
 * Add Employee Page
 * Form to create new employee records
 */
const AddEmployee = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success',
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, show: false });
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await employeeService.createEmployee(formData);
      showToast('Employee created successfully!', 'success');
      
      // Redirect to employees list after 1.5 seconds
      setTimeout(() => {
        navigate('/employees');
      }, 1500);
    } catch (error) {
      showToast(
        error.message || 'Failed to create employee. Please try again.',
        'error'
      );
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col">
          <h2 className="mb-1">
            <i className="bi bi-person-plus me-2"></i>
            Add New Employee
          </h2>
          <p className="text-muted">Create a new employee record in the system</p>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-10 mx-auto">
          <div className="card shadow-sm">
            <div className="card-header">
              <i className="bi bi-file-earmark-text me-2"></i>
              Employee Information
            </div>
            <div className="card-body">
              <div className="alert alert-info mb-4" role="alert">
                <i className="bi bi-info-circle me-2"></i>
                <strong>Note:</strong> All fields marked with <span className="text-danger">*</span> are required.
              </div>
              
              <EmployeeForm
                onSubmit={handleSubmit}
                loading={loading}
                mode="create"
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

export default AddEmployee;