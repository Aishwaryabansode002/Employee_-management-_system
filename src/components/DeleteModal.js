import React from 'react';

/**
 * Delete Confirmation Modal Component
 * Displays confirmation dialog before deleting an employee
 */
const DeleteModal = ({ show, employee, onConfirm, onCancel, loading }) => {
  if (!show) return null;

  return (
    <>
      <div className="modal show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Confirm Delete
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onCancel}
                disabled={loading}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p className="mb-3">
                Are you sure you want to delete this employee?
              </p>
              {employee && (
                <div className="alert alert-light border">
                  <div className="row">
                    <div className="col-4 fw-bold">Employee ID:</div>
                    <div className="col-8">{employee.employeeId}</div>
                  </div>
                  <div className="row">
                    <div className="col-4 fw-bold">Name:</div>
                    <div className="col-8">{employee.fullName}</div>
                  </div>
                  <div className="row">
                    <div className="col-4 fw-bold">Email:</div>
                    <div className="col-8">{employee.email}</div>
                  </div>
                </div>
              )}
              <p className="text-muted small mb-0">
                <i className="bi bi-info-circle me-1"></i>
                This action will soft delete the employee. The record will be marked as inactive.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={onConfirm}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-trash me-2"></i>
                    Delete Employee
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </>
  );
};

export default DeleteModal;