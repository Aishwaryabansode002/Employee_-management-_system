import React, { useEffect } from 'react';

/**
 * Toast Notification Component
 * Displays temporary notification messages
 */
const Toast = ({ show, message, type = 'success', onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'bi-check-circle-fill';
      case 'error':
        return 'bi-x-circle-fill';
      case 'warning':
        return 'bi-exclamation-triangle-fill';
      case 'info':
        return 'bi-info-circle-fill';
      default:
        return 'bi-check-circle-fill';
    }
  };

  const getBgClass = () => {
    switch (type) {
      case 'success':
        return 'bg-success';
      case 'error':
        return 'bg-danger';
      case 'warning':
        return 'bg-warning';
      case 'info':
        return 'bg-info';
      default:
        return 'bg-success';
    }
  };

  return (
    <div className="toast-container">
      <div className={`toast show fade-in ${getBgClass()} text-white`} role="alert">
        <div className="toast-header">
          <i className={`bi ${getIcon()} me-2`}></i>
          <strong className="me-auto">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </strong>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
        <div className="toast-body">{message}</div>
      </div>
    </div>
  );
};

export default Toast;