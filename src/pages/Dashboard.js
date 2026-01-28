import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import employeeService from '../services/employeeService';

/**
 * Dashboard Page
 * Displays employee statistics and overview
 */
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await employeeService.getStats();
      setStats(response.data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
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

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col">
          <h2 className="mb-1">
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </h2>
          <p className="text-muted">Employee management system overview</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div
            className="stat-card"
            style={{
              '--card-gradient-start': '#198754',
              '--card-gradient-end': '#20c997',
            }}
          >
            <div className="stat-icon">
              <i className="bi bi-people-fill"></i>
            </div>
            <div className="stat-value">{stats?.totalEmployees || 0}</div>
            <div className="stat-label">Total Employees</div>
          </div>
        </div>

        <div className="col-md-3">
          <div
            className="stat-card"
            style={{
              '--card-gradient-start': '#0d6efd',
              '--card-gradient-end': '#0dcaf0',
            }}
          >
            <div className="stat-icon">
              <i className="bi bi-person-check-fill"></i>
            </div>
            <div className="stat-value">{stats?.totalActive || 0}</div>
            <div className="stat-label">Active Employees</div>
          </div>
        </div>

        <div className="col-md-3">
          <div
            className="stat-card"
            style={{
              '--card-gradient-start': '#ffc107',
              '--card-gradient-end': '#fd7e14',
            }}
          >
            <div className="stat-icon">
              <i className="bi bi-person-dash-fill"></i>
            </div>
            <div className="stat-value">{stats?.totalInactive || 0}</div>
            <div className="stat-label">Inactive Employees</div>
          </div>
        </div>

        <div className="col-md-3">
          <div
            className="stat-card"
            style={{
              '--card-gradient-start': '#dc3545',
              '--card-gradient-end': '#e83e8c',
            }}
          >
            <div className="stat-icon">
              <i className="bi bi-trash-fill"></i>
            </div>
            <div className="stat-value">{stats?.totalDeleted || 0}</div>
            <div className="stat-label">Deleted Records</div>
          </div>
        </div>
      </div>

      {/* Department Statistics */}
      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header">
              <i className="bi bi-bar-chart-fill me-2"></i>
              Department Statistics
            </div>
            <div className="card-body">
              {stats?.departmentStats && stats.departmentStats.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Department</th>
                        <th className="text-center">Employee Count</th>
                        <th className="text-end">Average Salary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.departmentStats.map((dept, index) => (
                        <tr key={index}>
                          <td>
                            <strong>{dept._id}</strong>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-primary">{dept.count}</span>
                          </td>
                          <td className="text-end">
                            {formatCurrency(dept.avgSalary)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-muted py-4">
                  <i className="bi bi-inbox display-4"></i>
                  <p className="mt-2">No department data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <i className="bi bi-lightning-fill me-2"></i>
              Quick Actions
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <Link to="/add-employee" className="btn btn-primary btn-icon">
                  <i className="bi bi-person-plus me-2"></i>
                  Add New Employee
                </Link>
                <Link to="/employees" className="btn btn-outline-primary btn-icon">
                  <i className="bi bi-people me-2"></i>
                  View All Employees
                </Link>
                <button
                  onClick={fetchStats}
                  className="btn btn-outline-secondary btn-icon"
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Refresh Statistics
                </button>
              </div>

              <hr className="my-4" />

              <div className="alert alert-info mb-0">
                <i className="bi bi-info-circle me-2"></i>
                <strong>System Information</strong>
                <div className="mt-2 small">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Last Updated:</span>
                    <span>{new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Version:</span>
                    <span>1.0.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;