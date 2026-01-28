import React from 'react';

/**
 * History Timeline Component
 * Displays employee change history in timeline format
 */
const HistoryTimeline = ({ history }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    if (typeof value === 'object' && value instanceof Date) {
      return formatDate(value);
    }
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return value.toString();
  };

  const getOperationBadge = (operation) => {
    switch (operation) {
      case 'CREATE':
        return <span className="badge bg-success">Created</span>;
      case 'UPDATE':
        return <span className="badge bg-info">Updated</span>;
      case 'DELETE':
        return <span className="badge bg-danger">Deleted</span>;
      default:
        return <span className="badge bg-secondary">{operation}</span>;
    }
  };

  const getOperationClass = (operation) => {
    switch (operation) {
      case 'CREATE':
        return 'create';
      case 'UPDATE':
        return 'update';
      case 'DELETE':
        return 'delete';
      default:
        return 'update';
    }
  };

  if (history.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <i className="bi bi-clock-history"></i>
        </div>
        <h4>No History Available</h4>
        <p>There are no recorded changes for this employee.</p>
      </div>
    );
  }

  return (
    <div className="timeline">
      {history.map((record, index) => (
        <div key={record.id || index} className="timeline-item fade-in">
          <div className={`timeline-marker ${getOperationClass(record.operation)}`}></div>
          <div className="timeline-content">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                {getOperationBadge(record.operation)}
                <span className="ms-2 text-muted">by {record.changedBy}</span>
              </div>
              <div className="timeline-date">
                <i className="bi bi-calendar3 me-1"></i>
                {formatDate(record.timestamp)}
              </div>
            </div>

            {record.changeReason && (
              <div className="alert alert-light border-start border-primary border-3 mb-3">
                <small>
                  <strong>Reason:</strong> {record.changeReason}
                </small>
              </div>
            )}

            {record.operation === 'CREATE' && (
              <div className="text-muted">
                <i className="bi bi-info-circle me-2"></i>
                Employee record was created in the system
              </div>
            )}

            {record.operation === 'DELETE' && (
              <div className="text-danger">
                <i className="bi bi-trash me-2"></i>
                Employee record was deleted from the system
              </div>
            )}

            {record.operation === 'UPDATE' && record.changes && record.changes.length > 0 && (
              <div>
                <strong className="d-block mb-2">
                  <i className="bi bi-pencil me-2"></i>
                  Changes Made ({record.changes.length}):
                </strong>
                <div className="row g-2">
                  {record.changes.map((change, idx) => (
                    <div key={idx} className="col-12">
                      <div className="change-item">
                        <div className="change-field mb-1">
                          {change.field
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, (str) => str.toUpperCase())}
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <small className="text-muted d-block">Old Value:</small>
                            <span className="change-value text-danger">
                              {formatValue(change.oldValue)}
                            </span>
                          </div>
                          <div className="col-md-6">
                            <small className="text-muted d-block">New Value:</small>
                            <span className="change-value text-success">
                              {formatValue(change.newValue)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryTimeline;