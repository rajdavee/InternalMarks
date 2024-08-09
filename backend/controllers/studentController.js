const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const { sendMail } = require('../config/nodemailer');
const crypto = require('crypto');


const loginStudent = async (req, res) => {
  console.log('Login request received:', req.body); // Log incoming request
  try {
    const { email, password } = req.body;
    
    // Check if student exists
    const student = await Student.findOne({ email });
    if (!student) {
      console.log('Student not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Compare password
    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = student.generateAuthToken();
    
    console.log('Login successful, token generated');
    res.status(200).json({ token, user: student });
  } catch (err) {
    console.error('Error in loginStudent:', err);
    res.status(500).json({ message: 'Server error' });
  }
};




const logoutStudent = (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
};

const getStudentDetails = async (req, res) => {
  const studentId = req.user.id;

  try {
    const student = await Student.findById(studentId).populate('marks.subjectId');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const marksDetails = student.marks.map(mark => ({
      subject: mark.subjectId.name,
      mark: mark.mark
    }));

    res.status(200).json({
      name: student.name,
      enrollmentNumber: student.enrollmentNumber,
      department: student.department,
      marks: marksDetails
    });
  } catch (error) {
    console.error('Error retrieving student details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateStudentProfile = async (req, res) => {
  const studentId = req.user.id;
  const { name, email, password } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (name) student.name = name;
    if (email) student.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      student.password = await bcrypt.hash(password, salt);
    }

    await student.save();
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    student.resetPasswordToken = resetToken;
    student.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await student.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of the password for your account.\n\nPlease make a PUT request to the following link to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`;

    await sendMail(student.email, 'Password Reset Request', message);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error processing forgot password request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const student = await Student.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!student) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(password, salt);
    student.resetPasswordToken = undefined;
    student.resetPasswordExpires = undefined;

    await student.save();
    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  loginStudent,
  logoutStudent,
  getStudentDetails,
  updateStudentProfile,
  forgotPassword,
  resetPassword,
};
