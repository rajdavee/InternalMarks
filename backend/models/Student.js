// models/Student.js
const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
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
}, { timestamps: true });

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;
