const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const studentSchema = new mongoose.Schema({
  enrollmentNumber: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  marks: [
    {
      subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
      },
      mark: {
        type: Number,
        required: true,
      },
    }
  ],
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  role: {
    type: String,
    enum: ['student'],
    default: 'student',
  },
}, { timestamps: true });
;


studentSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

// Method to generate JWT token
studentSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
