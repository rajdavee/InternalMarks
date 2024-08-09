const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Faculty = require('../models/Faculty');
const Marks = require('../models/Marks');
const Student = require('../models/Student');
const Subject = require('../models/Subject');

// Function to add marks
const addMarks = async (req, res) => {
  const { studentId, subjectId, facultyId, className, marks } = req.body;

  try {
    // Check if student and subject exist
    const student = await Student.findById(studentId);
    const subject = await Subject.findById(subjectId);

    if (!student || !subject) {
      return res.status(404).json({ message: 'Student or Subject not found' });
    }

    // Create new marks entry
    const newMarks = new Marks({
      studentId,
      subjectId,
      facultyId,
      className,
      marks,
    });

    // Save new marks entry
    await newMarks.save();

    // Update student's marks array
    student.marks.push({
      subjectId: subject._id,
      mark: marks,
    });

    await student.save();

    res.status(201).json({ message: 'Marks added successfully', marks: newMarks });
  } catch (error) {
    console.error('Error adding marks:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const loginFaculty = async (req, res) => {
  console.log('Login request received:', req.body); 
  try {
    const { email, password } = req.body;
    
    // Find the faculty by email
    const faculty = await Faculty.findOne({ email });
    if (!faculty) {
      console.log('Faculty not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Compare password
    const isMatch = await bcrypt.compare(password, faculty.password);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: faculty._id, role: faculty.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    console.log('Login successful, token generated');
    res.status(200).json({ token, user: faculty });
  } catch (err) {
    console.error('Error in loginFaculty:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



// Function to logout faculty
const logoutFaculty = (req, res) => {
  // Notify client to delete the token or perform other cleanup if necessary
  res.status(200).json({ message: 'Logout successful' });
};

module.exports = {
  addMarks,
  loginFaculty,
  logoutFaculty,
};
