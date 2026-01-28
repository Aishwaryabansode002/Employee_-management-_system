import React, { useState, useEffect } from 'react';

/**
 * Employee Form Component
 * Reusable form for creating and editing employees
 */
const EmployeeForm = ({ initialData, onSubmit, loading, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    department: '',
    designation: '',
    salary: '',
    employmentStatus: 'Active',
    dateOfJoining: '',
  });

  const [errors, setErrors] = useState({});

  const departments = [
    'Engineering',
    'Marketing',
    'Sales',
    'Human Resources',
    'Finance',
    'Operations',
    'IT',
    'Customer Support',
    'Administration',
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        dateOfJoining: initialData.dateOfJoining
          ? new Date(initialData.dateOfJoining).toISOString().split('T')[0]
          : '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }

    if (!formData.salary) {
      newErrors.salary = 'Salary is required';
    } else if (parseFloat(formData.salary) < 0) {
      newErrors.salary = 'Salary must be a positive number';
    }

    if (!formData.dateOfJoining) {
      newErrors.dateOfJoining = 'Date of joining is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="fullName" className="form-label">
            Full Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter full name"
          />
          {errors.fullName && (
            <div className="invalid-feedback">{errors.fullName}</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="email" className="form-label">
            Email <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="phoneNumber" className="form-label">
            Phone Number <span className="text-danger">*</span>
          </label>
          <input
            type="tel"
            className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
          {errors.phoneNumber && (
            <div className="invalid-feedback">{errors.phoneNumber}</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="department" className="form-label">
            Department <span className="text-danger">*</span>
          </label>
          <select
            className={`form-select ${errors.department ? 'is-invalid' : ''}`}
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {errors.department && (
            <div className="invalid-feedback">{errors.department}</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="designation" className="form-label">
            Designation <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.designation ? 'is-invalid' : ''}`}
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="Enter designation"
          />
          {errors.designation && (
            <div className="invalid-feedback">{errors.designation}</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="salary" className="form-label">
            Salary <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            className={`form-control ${errors.salary ? 'is-invalid' : ''}`}
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="Enter salary"
            min="0"
            step="0.01"
          />
          {errors.salary && (
            <div className="invalid-feedback">{errors.salary}</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="employmentStatus" className="form-label">
            Employment Status <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            id="employmentStatus"
            name="employmentStatus"
            value={formData.employmentStatus}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="dateOfJoining" className="form-label">
            Date of Joining <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            className={`form-control ${errors.dateOfJoining ? 'is-invalid' : ''}`}
            id="dateOfJoining"
            name="dateOfJoining"
            value={formData.dateOfJoining}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.dateOfJoining && (
            <div className="invalid-feedback">{errors.dateOfJoining}</div>
          )}
        </div>
      </div>

      <div className="d-flex gap-2 mt-4">
        <button
          type="submit"
          className="btn btn-primary btn-icon"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              {mode === 'create' ? 'Creating...' : 'Updating...'}
            </>
          ) : (
            <>
              <i className={`bi ${mode === 'create' ? 'bi-plus-circle' : 'bi-check-circle'} me-2`}></i>
              {mode === 'create' ? 'Create Employee' : 'Update Employee'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;