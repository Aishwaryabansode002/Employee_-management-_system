import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Navigation Bar Component
 * Displays application navigation with active state highlighting
 */
const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-building me-2"></i>
          Employee Management System
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} to="/">
                <i className="bi bi-speedometer2 me-1"></i>
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/employees')}`} to="/employees">
                <i className="bi bi-people me-1"></i>
                Employees
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/add-employee')}`} to="/add-employee">
                <i className="bi bi-person-plus me-1"></i>
                Add Employee
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;