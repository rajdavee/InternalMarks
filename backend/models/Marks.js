// models/Marks.js
const mongoose = require('mongoose');

const MarksSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true,
  },
  className: {
    type: String,
    required: true,
  },
  marks: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const Marks = mongoose.model('Marks', MarksSchema);

module.exports = Marks;
