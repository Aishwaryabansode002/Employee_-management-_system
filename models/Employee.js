const mongoose = require('mongoose');

/**
 * Employee Schema
 */
const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    department: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    employmentStatus: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    dateOfJoining: {
      type: Date,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

/**
 * Auto-generate employeeId
 */
employeeSchema.pre('validate', function (next) {
  if (this.isNew && !this.employeeId) {
    this.employeeId = `EMP-${Date.now()}`;
  }
  next();
});

/**
 * Soft delete
 */
employeeSchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.employmentStatus = 'Inactive';
  return this.save();
};

module.exports = mongoose.model('Employee', employeeSchema);
