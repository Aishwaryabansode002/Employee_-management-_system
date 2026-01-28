const Employee = require('../models/Employee');
const EmployeeHistory = require('../models/EmployeeHistory');


/**
 * @desc    Create new employee
 * @route   POST /api/employees
 * @access  Public
 */
const createEmployee = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      department,
      designation,
      salary,
      employmentStatus,
      dateOfJoining,
    } = req.body;

    const employee = await Employee.create({
      fullName,
      email,
      phoneNumber,
      department,
      designation,
      salary,
      employmentStatus: employmentStatus || 'Active',
      dateOfJoining,
    });

    await EmployeeHistory.createHistory(
      employee._id,
      employee.employeeId,
      'CREATE',
      null,
      employee.toObject(),
      'system',
      'Employee record created'
    );

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all active employees
 * @route   GET /api/employees
 * @access  Public
 */
const getAllEmployees = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      department,
      employmentStatus,
    } = req.query;

    const query = { isDeleted: false };

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
      ];
    }

    if (department) query.department = department;
    if (employmentStatus) query.employmentStatus = employmentStatus;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const employees = await Employee.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Employee.countDocuments(query);

    res.status(200).json({
      success: true,
      data: employees,
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
 * @desc    Get employee by ID
 * @route   GET /api/employees/:id
 * @access  Public
 */
const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update employee
 * @route   PUT /api/employees/:id
 * @access  Public
 */
const updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const oldData = employee.toObject();

    Object.assign(employee, req.body);
    await employee.save();

    await EmployeeHistory.createHistory(
      employee._id,
      employee.employeeId,
      'UPDATE',
      oldData,
      employee.toObject(),
      'system',
      'Employee record updated'
    );

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Soft delete employee
 * @route   DELETE /api/employees/:id
 * @access  Public
 */
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const oldData = employee.toObject();

    employee.isDeleted = true;
    await employee.save();

    await EmployeeHistory.createHistory(
      employee._id,
      employee.employeeId,
      'DELETE',
      oldData,
      employee.toObject(),
      'system',
      'Employee record deleted'
    );

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get employee statistics
 * @route   GET /api/employees/stats/overview
 * @access  Public
 */
const getEmployeeStats = async (req, res, next) => {
  try {
    const totalActive = await Employee.countDocuments({
      isDeleted: false,
      employmentStatus: 'Active',
    });

    const totalInactive = await Employee.countDocuments({
      isDeleted: false,
      employmentStatus: 'Inactive',
    });

    const totalDeleted = await Employee.countDocuments({
      isDeleted: true,
    });

    const departmentStats = await Employee.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          avgSalary: { $avg: '$salary' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalActive,
        totalInactive,
        totalDeleted,
        totalEmployees: totalActive + totalInactive,
        departmentStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
};
