const { body, param, validationResult } = require('express-validator');

/**
 * Validation middleware for employee operations
 * Implements comprehensive input validation rules
 */

/**
 * Validate employee creation/update data
 */
const validateEmployee = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
    .withMessage('Please provide a valid phone number'),
  
  body('department')
    .trim()
    .notEmpty()
    .withMessage('Department is required')
    .isIn([
      'Engineering',
      'Marketing',
      'Sales',
      'Human Resources',
      'Finance',
      'Operations',
      'IT',
      'Customer Support',
      'Administration',
    ])
    .withMessage('Invalid department'),
  
  body('designation')
    .trim()
    .notEmpty()
    .withMessage('Designation is required')
    .isLength({ max: 100 })
    .withMessage('Designation cannot exceed 100 characters'),
  
  body('salary')
    .notEmpty()
    .withMessage('Salary is required')
    .isFloat({ min: 0 })
    .withMessage('Salary must be a positive number'),
  
  body('employmentStatus')
    .optional()
    .isIn(['Active', 'Inactive'])
    .withMessage('Employment status must be Active or Inactive'),
  
  body('dateOfJoining')
    .notEmpty()
    .withMessage('Date of joining is required')
    .isISO8601()
    .withMessage('Please provide a valid date'),
];

/**
 * Validate MongoDB ObjectId parameter
 */
const validateObjectId = [
  param('id')
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage('Invalid employee ID format'),
];

/**
 * Check validation results and return errors
 */
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  
  next();
};

module.exports = {
  validateEmployee,
  validateObjectId,
  checkValidation,
};