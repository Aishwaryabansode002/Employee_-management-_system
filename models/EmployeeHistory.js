const mongoose = require('mongoose');

/**
 * Employee History Schema
 * Maintains audit trail of all employee changes
 * Stores snapshots of previous states and change details
 */
const employeeHistorySchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
      index: true,
    },
    employeeRefId: {
      type: String,
      required: true,
      index: true,
    },
    operation: {
      type: String,
      required: true,
      enum: ['CREATE', 'UPDATE', 'DELETE'],
    },
    changes: [
      {
        field: {
          type: String,
          required: true,
        },
        oldValue: {
          type: mongoose.Schema.Types.Mixed,
        },
        newValue: {
          type: mongoose.Schema.Types.Mixed,
        },
      },
    ],
    snapshot: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    changedBy: {
      type: String,
      default: 'system',
    },
    changeReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Index for efficient history queries
 */
employeeHistorySchema.index({ employeeId: 1, createdAt: -1 });

/**
 * Static method to create history record
 */
employeeHistorySchema.statics.createHistory = async function (
  employeeId,
  employeeRefId,
  operation,
  oldData,
  newData,
  changedBy = 'system',
  changeReason = ''
) {
  const changes = [];

  // Calculate field-level changes
  if (operation === 'UPDATE' && oldData) {
    const fieldsToTrack = [
      'fullName',
      'email',
      'phoneNumber',
      'department',
      'designation',
      'salary',
      'employmentStatus',
      'dateOfJoining',
    ];

    fieldsToTrack.forEach((field) => {
      const oldValue = oldData[field];
      const newValue = newData[field];

      // Check if value actually changed
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.push({
          field,
          oldValue,
          newValue,
        });
      }
    });
  }

  // Create history record
  const historyRecord = await this.create({
    employeeId,
    employeeRefId,
    operation,
    changes,
    snapshot: newData,
    changedBy,
    changeReason,
  });

  return historyRecord;
};

/**
 * Static method to get employee history with formatted output
 */
employeeHistorySchema.statics.getEmployeeHistory = async function (employeeId) {
  const history = await this.find({ employeeId })
    .sort({ createdAt: -1 })
    .lean();

  return history.map((record) => ({
    id: record._id,
    operation: record.operation,
    changes: record.changes,
    timestamp: record.createdAt,
    changedBy: record.changedBy,
    changeReason: record.changeReason,
    snapshot: record.snapshot,
  }));
};

const EmployeeHistory = mongoose.model('EmployeeHistory', employeeHistorySchema);

module.exports = EmployeeHistory;