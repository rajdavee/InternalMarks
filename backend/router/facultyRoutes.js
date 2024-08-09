const express = require('express');
const router = express.Router();
const { authMiddleware, verifyRole } = require('../middleware/authMiddleware');
const { addMarks, loginFaculty, logoutFaculty } = require('../controllers/facultyController');

// Route for faculty login (no authentication required)
router.post('/login', loginFaculty);

// Route for faculty logout (requires authentication)
router.post('/logout', authMiddleware, logoutFaculty);

// Route for adding marks (requires authentication and faculty role)
router.post('/add-marks', authMiddleware, verifyRole(['faculty']), addMarks);

module.exports = router;
