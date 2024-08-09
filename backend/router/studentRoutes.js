const express = require('express');
const router = express.Router();
const { authMiddleware, verifyRole } = require('../middleware/authMiddleware');
const { 
  loginStudent, 
  logoutStudent,
  getStudentDetails,
  updateStudentProfile,
  forgotPassword, 
  resetPassword
} = require('../controllers/studentController');

// Route for student login (Public)
router.post('/login', loginStudent);

// Route for student logout (Protected)
router.post('/logout', authMiddleware, logoutStudent);

// Route for getting student details (Protected and role check for 'student')
router.get('/details', authMiddleware, verifyRole(['student']), getStudentDetails);

// Route for updating student profile (Protected and role check for 'student')
router.put('/update', authMiddleware, verifyRole(['student']), updateStudentProfile);

// Route for forgot password (Public)
router.post('/forgot-password', forgotPassword);

// Route for reset password (Public)
router.post('/reset-password/:token', resetPassword);

module.exports = router;
