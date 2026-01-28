const express = require('express');
const router = express.Router();
const {
  getEmployeeHistory,
  getHistoryDetails,
  compareVersions,
} = require('../controllers/historyController');
const { validateObjectId, checkValidation } = require('../middleware/validator');

/**
 * History Routes
 */

// Get employee history
router.get(
  '/employees/:id/history',
  validateObjectId,
  checkValidation,
  getEmployeeHistory
);

// Compare versions
router.get(
  '/employees/:id/history/compare',
  validateObjectId,
  checkValidation,
  compareVersions
);

// Get specific history record
router.get('/history/:historyId', getHistoryDetails);

module.exports = router;