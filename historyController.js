const EmployeeHistory = require('../models/EmployeeHistory');
const Employee = require('../models/Employee');

/**
 * @desc    Get employee change history
 * @route   GET /api/employees/:id/history
 * @access  Public
 */
const getEmployeeHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Check if employee exists
    const employee = await Employee.findById(id);
    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Fetch history records
    const history = await EmployeeHistory.find({ employeeId: id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count
    const total = await EmployeeHistory.countDocuments({ employeeId: id });

    // Format response
    const formattedHistory = history.map((record) => ({
      id: record._id,
      operation: record.operation,
      changes: record.changes,
      timestamp: record.createdAt,
      changedBy: record.changedBy,
      changeReason: record.changeReason,
    }));

    res.status(200).json({
      success: true,
      data: {
        employee: {
          id: employee._id,
          employeeId: employee.employeeId,
          fullName: employee.fullName,
        },
        history: formattedHistory,
      },
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get specific history record details
 * @route   GET /api/history/:historyId
 * @access  Public
 */
const getHistoryDetails = async (req, res, next) => {
  try {
    const { historyId } = req.params;

    const history = await EmployeeHistory.findById(historyId)
      .populate('employeeId', 'employeeId fullName email')
      .lean();

    if (!history) {
      res.status(404);
      throw new Error('History record not found');
    }

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Compare two versions of employee data
 * @route   GET /api/employees/:id/history/compare
 * @access  Public
 */
const compareVersions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { versionId1, versionId2 } = req.query;

    if (!versionId1 || !versionId2) {
      res.status(400);
      throw new Error('Both version IDs are required for comparison');
    }

    const version1 = await EmployeeHistory.findOne({
      _id: versionId1,
      employeeId: id,
    });

    const version2 = await EmployeeHistory.findOne({
      _id: versionId2,
      employeeId: id,
    });

    if (!version1 || !version2) {
      res.status(404);
      throw new Error('One or both versions not found');
    }

    // Calculate differences
    const differences = [];
    const fields = [
      'fullName',
      'email',
      'phoneNumber',
      'department',
      'designation',
      'salary',
      'employmentStatus',
      'dateOfJoining',
    ];

    fields.forEach((field) => {
      const val1 = version1.snapshot[field];
      const val2 = version2.snapshot[field];

      if (JSON.stringify(val1) !== JSON.stringify(val2)) {
        differences.push({
          field,
          version1Value: val1,
          version2Value: val2,
        });
      }
    });

    res.status(200).json({
      success: true,
      data: {
        version1: {
          id: version1._id,
          timestamp: version1.createdAt,
          snapshot: version1.snapshot,
        },
        version2: {
          id: version2._id,
          timestamp: version2.createdAt,
          snapshot: version2.snapshot,
        },
        differences,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployeeHistory,
  getHistoryDetails,
  compareVersions,
};