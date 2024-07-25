// routes/facultyRoutes.js
const express = require('express');
const addMarks = require('../controllers/facultyController');

const router = express.Router();

router.post('/add-marks', addMarks);

module.exports = router;
