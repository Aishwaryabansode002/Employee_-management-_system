import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import HistoryTimeline from '../components/HistoryTimeLine'; // ✅ FIXED CASE
import Toast from '../components/Toast';
import employeeService from '../services/employeeService';

/**
 * Employee History Page
 * Displays complete change history for an employee
 */
const EmployeeHistory = () => {
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const [refreshKey, setRefreshKey] = useState(0); // ✅ for manual refresh

  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success',
  });

  /* ✅ FIXED useEffect (NO ESLINT WARNING) */
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);

        const response = await employeeService.getEmployeeHistory(id, {
          page: pagination.page,
          limit: pagination.limit,
        });

        setEmployee(response.data.employee);
        setHistory(response.data.history);

        setPagination((prev) => ({
          ...prev,
          ...response.pagination,
        }));
      } catch (error) {
        showToast(
          error.message || 'Failed to load employee history',
          'error'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [id, pagination.page, refreshKey]);

  /* ---------------- HELPERS ---------------- */

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
    window.scrollTo(0, 0);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1); // ✅ triggers useEffect
  };

  /* ---------------- LOADING STATE ---------------- */

  if (loading && !employee) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col">
          <h2 className="mb-1">
            <i className="bi bi-clock-history me-2"></i>
            Employee History
          </h2>
          {employee && (
            <p className="text-muted">
              Change history for <strong>{employee.fullName}</strong> (
              {employee.employeeId})
            </p>
          )}
        </div>
      </div>

      <div className="col-lg-10 mx-auto">
        {/* Employee Info */}
        {employee && (
          <div className="card shadow-sm mb-4">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <strong>{employee.fullName}</strong>
                <div className="text-muted">{employee.employeeId}</div>
              </div>
              <Link
                to={`/edit-employee/${id}`}
                className="btn btn-sm btn-outline-primary"
              >
                <i className="bi bi-pencil me-2"></i>
                Edit
              </Link>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          This timeline shows all changes made to the employee record.
        </div>

        {/* History Timeline */}
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between">
            <span>
              <i className="bi bi-list-ul me-2"></i>
              History ({pagination.total})
            </span>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={handleRefresh}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Refresh
            </button>
          </div>

          <div className="card-body">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" />
              </div>
            ) : (
              <HistoryTimeline history={history} />
            )}
          </div>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <nav className="mt-4">
            <ul className="pagination justify-content-center">
              {Array.from({ length: pagination.totalPages }).map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${
                    pagination.page === i + 1 ? 'active' : ''
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Navigation */}
        <div className="d-flex gap-2 mt-4">
          <Link to="/employees" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-2"></i>
            Back
          </Link>
          <Link to={`/employee/${id}`} className="btn btn-outline-info">
            <i className="bi bi-eye me-2"></i>
            View Employee
          </Link>
        </div>
      </div>

      {/* Toast */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </div>
  );
};

export default EmployeeHistory;
