import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EmployeeTable from '../components/EmployeeTable';
import DeleteModal from '../components/DeleteModal';
import Toast from '../components/Toast';
import employeeService from '../services/employeeService';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState({
    search: '',
    department: '',
    employmentStatus: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success',
  });

  const departments = [
    'Engineering',
    'Marketing',
    'Sales',
    'Human Resources',
    'Finance',
    'Operations',
    'IT',
    'Customer Support',
    'Administration',
  ];

  /* ✅ FIXED useEffect (NO ESLINT WARNING) */
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          ...filters,
        };

        const response = await employeeService.getAllEmployees(params);

        setEmployees(response.data);
        setPagination((prev) => ({
          ...prev,
          ...response.pagination,
        }));
      } catch (error) {
        showToast(error.message || 'Failed to load employees', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [pagination.page, filters]);

  /* ---------------- HELPERS ---------------- */

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  const handleSearch = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSort = (column) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: column,
      sortOrder:
        prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
    window.scrollTo(0, 0);
  };

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      await employeeService.deleteEmployee(selectedEmployee._id);
      showToast('Employee deleted successfully');
      setShowDeleteModal(false);
      setSelectedEmployee(null);

      // refresh list
      setPagination((prev) => ({ ...prev }));
    } catch (error) {
      showToast(error.message || 'Failed to delete employee', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSelectedEmployee(null);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      department: '',
      employmentStatus: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col">
          <h2 className="mb-1">
            <i className="bi bi-people me-2"></i> Employee List
          </h2>
          <p className="text-muted">
            Showing {employees.length} of {pagination.total} employees
          </p>
        </div>
        <div className="col-auto">
          <Link to="/add-employee" className="btn btn-primary">
            <i className="bi bi-person-plus me-2"></i> Add Employee
          </Link>
        </div>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : (
            <EmployeeTable
              employees={employees}
              onDelete={handleDeleteClick}
              onSort={handleSort}
              sortBy={filters.sortBy}
              sortOrder={filters.sortOrder}
            />
          )}
        </div>
      </div>

      {/* DELETE MODAL */}
      <DeleteModal
        show={showDeleteModal}
        employee={selectedEmployee}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleteLoading}
      />

      {/* TOAST */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </div>
  );
};

export default EmployeeList;
