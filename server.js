require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const employeeRoutes = require('./routes/employeeRoutes');
const historyRoutes = require('./routes/historyRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/employees', employeeRoutes);
app.use('/api', historyRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Employee Management System API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      employees: '/api/employees',
      history: '/api/employees/:id/history',
      stats: '/api/employees/stats/overview',
    },
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
    ╔════════════════════════════════════════════╗
    ║   Employee Management System - Backend    ║
    ║   Server running on port ${PORT}           ║
    ║   Environment: ${process.env.NODE_ENV || 'development'}              ║
    ╚════════════════════════════════════════════╝
  `);
});