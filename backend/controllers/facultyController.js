// controllers/facultyController.js
const Marks = require('../models/Marks');
const Student = require('../models/Student');
const Subject = require('../models/Subject');

const addMarks = async (req, res) => {
  const { studentId, subjectId, facultyId, class: className, marks } = req.body;

  try {
    const student = await Student.findById(studentId);
    const subject = await Subject.findById(subjectId);

    if (!student || !subject) {
      return res.status(404).json({ message: 'Student or Subject not found' });
    }

    const newMarks = new Marks({
      studentId,
      subjectId,
      facultyId,
      class: className,
      marks,
    });

    await newMarks.save();

    res.status(201).json({ message: 'Marks added successfully', marks: newMarks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = addMarks;
