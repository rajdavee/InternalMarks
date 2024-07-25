// models/Subject.js
const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Subject = mongoose.model('Subject', SubjectSchema);

module.exports = Subject;
