const express = require('express');
const router = express.Router();
const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
} = require('../controllers/employeeController');
const {
  validateEmployee,
  validateObjectId,
  checkValidation,
} = require('../middleware/validator');

/**
 * Employee Routes
 * All routes are prefixed with /api/employees
 */

// Stats route (must come before :id route)
router.get('/stats/overview', getEmployeeStats);

// Main CRUD routes
router
  .route('/')
  .get(getAllEmployees)
  .post(validateEmployee, checkValidation, createEmployee);

router
  .route('/:id')
  .get(validateObjectId, checkValidation, getEmployeeById)
  .put(validateObjectId, validateEmployee, checkValidation, updateEmployee)
  .delete(validateObjectId, checkValidation, deleteEmployee);

module.exports = router;