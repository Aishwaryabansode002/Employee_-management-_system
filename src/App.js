import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddEmployee from './pages/AddEmployee';
import EditEmployee from './pages/EditEmployee';
import EmployeeList from './pages/EmployeeList';
import EmployeeHistory from './pages/EmployeeHistory';
import EmployeeDetails from './pages/EmployeeDetails';

import './styles/custom.css';

function App() {
  return (
    <Router>
      <div className="app-container d-flex flex-column min-vh-100">
        <Navbar />

        <main className="main-content flex-fill">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/add-employee" element={<AddEmployee />} />
            <Route path="/edit-employee/:id" element={<EditEmployee />} />

            {/* ✅ VIEW EMPLOYEE */}
            <Route path="/employee/:id" element={<EmployeeDetails />} />

            {/* ✅ EMPLOYEE HISTORY */}
            <Route path="/employee/:id/history" element={<EmployeeHistory />} />

            {/* ❌ 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

/* ---------------- 404 PAGE ---------------- */
const NotFound = () => (
  <div className="container py-5 text-center">
    <h1 className="display-1 fw-bold">404</h1>
    <p className="text-muted">Page Not Found</p>
    <a href="/" className="btn btn-primary">Go to Dashboard</a>
  </div>
);

/* ---------------- FOOTER ---------------- */
const Footer = () => (
  <footer className="bg-light border-top py-3">
    <div className="container text-center">
      <p className="mb-0 text-muted">
        © {new Date().getFullYear()} Employee Management System | MERN ❤️
      </p>
    </div>
  </footer>
);

export default App;
