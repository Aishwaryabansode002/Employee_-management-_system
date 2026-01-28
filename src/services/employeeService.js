import api from './api';

/**
 * Employee Service
 * Handles all employee-related API calls
 */

const employeeService = {
  /**
   * Get all employees with optional filters
   */
  getAllEmployees: async (params = {}) => {
    return await api.get('/employees', params);
  },

  /**
   * Get employee by ID
   */
  getEmployeeById: async (id) => {
    return await api.get(`/employees/${id}`);
  },

  /**
   * Create new employee
   */
  createEmployee: async (employeeData) => {
    return await api.post('/employees', employeeData);
  },

  /**
   * Update employee
   */
  updateEmployee: async (id, employeeData) => {
    return await api.put(`/employees/${id}`, employeeData);
  },

  /**
   * Delete employee (soft delete)
   */
  deleteEmployee: async (id) => {
    return await api.delete(`/employees/${id}`);
  },

  /**
   * Get employee statistics
   */
  getStats: async () => {
    return await api.get('/employees/stats/overview');
  },

  /**
   * Get employee change history
   */
  getEmployeeHistory: async (id, params = {}) => {
    return await api.get(`/employees/${id}/history`, params);
  },

  /**
   * Compare two versions of employee data
   */
  compareVersions: async (id, versionId1, versionId2) => {
    return await api.get(`/employees/${id}/history/compare`, {
      versionId1,
      versionId2,
    });
  },
};

export default employeeService;