import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Employee Table Component
 * Displays employee list with sorting, pagination, and actions
 */
const EmployeeTable = ({
  employees,
  onDelete,
  onSort,
  sortBy,
  sortOrder,
}) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) {
      return <i className="bi bi-arrow-down-up ms-1"></i>;
    }
    return sortOrder === 'asc' ? (
      <i className="bi bi-arrow-up ms-1"></i>
    ) : (
      <i className="bi bi-arrow-down ms-1"></i>
    );
  };

  const handleSort = (column) => {
    onSort(column);
  };

  if (employees.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <i className="bi bi-inbox"></i>
        </div>
        <h4>No Employees Found</h4>
        <p>There are no employees matching your criteria.</p>
        <Link to="/add-employee" className="btn btn-primary mt-3">
          <i className="bi bi-plus-circle me-2"></i>
          Add New Employee
        </Link>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th
              onClick={() => handleSort('employeeId')}
              style={{ cursor: 'pointer' }}
            >
              Employee ID {getSortIcon('employeeId')}
            </th>
            <th
              onClick={() => handleSort('fullName')}
              style={{ cursor: 'pointer' }}
            >
              Full Name {getSortIcon('fullName')}
            </th>
            <th>Email</th>
            <th>Phone</th>
            <th
              onClick={() => handleSort('department')}
              style={{ cursor: 'pointer' }}
            >
              Department {getSortIcon('department')}
            </th>
            <th>Designation</th>
            <th
              onClick={() => handleSort('salary')}
              style={{ cursor: 'pointer' }}
            >
              Salary {getSortIcon('salary')}
            </th>
            <th
              onClick={() => handleSort('employmentStatus')}
              style={{ cursor: 'pointer' }}
            >
              Status {getSortIcon('employmentStatus')}
            </th>
            <th
              onClick={() => handleSort('dateOfJoining')}
              style={{ cursor: 'pointer' }}
            >
              Joined {getSortIcon('dateOfJoining')}
            </th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id} className="fade-in">
              <td>
                <strong>{employee.employeeId}</strong>
              </td>
              <td>{employee.fullName}</td>
              <td>
                <a href={`mailto:${employee.email}`} className="text-decoration-none">
                  {employee.email}
                </a>
              </td>
              <td>
                <a href={`tel:${employee.phoneNumber}`} className="text-decoration-none">
                  {employee.phoneNumber}
                </a>
              </td>
              <td>
                <span className="badge bg-secondary">{employee.department}</span>
              </td>
              <td>{employee.designation}</td>
              <td>{formatCurrency(employee.salary)}</td>
              <td>
                <span
                  className={`badge ${
                    employee.employmentStatus === 'Active'
                      ? 'bg-success'
                      : 'bg-warning'
                  }`}
                >
                  {employee.employmentStatus}
                </span>
              </td>
              <td>{formatDate(employee.dateOfJoining)}</td>
              <td>
                <div className="table-actions">
                  <Link
                    to={`/employee/${employee._id}`}
                    className="btn btn-sm btn-info text-white"
                    title="View Details"
                  >
                    <i className="bi bi-eye"></i>
                  </Link>
                  <Link
                    to={`/edit-employee/${employee._id}`}
                    className="btn btn-sm btn-warning"
                    title="Edit Employee"
                  >
                    <i className="bi bi-pencil"></i>
                  </Link>
                  <Link
                    to={`/employee/${employee._id}/history`}
                    className="btn btn-sm btn-secondary"
                    title="View History"
                  >
                    <i className="bi bi-clock-history"></i>
                  </Link>
                  <button
                    onClick={() => onDelete(employee)}
                    className="btn btn-sm btn-danger"
                    title="Delete Employee"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;