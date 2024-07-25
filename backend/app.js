// app.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Main API route
app.get('/api/v1', (req, res) => {
  res.send('API is running...');
});

// Faculty routes
const facultyRoutes = require('./router/facultyRoutes');
app.use('/api/v1/faculty', facultyRoutes);

module.exports = app;
