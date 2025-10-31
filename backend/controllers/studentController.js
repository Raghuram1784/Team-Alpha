const Student = require('../models/student');
const { sendEmail, emailTemplates } = require('../utils/emailService');

exports.createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    
    const template = emailTemplates.registration(student.name);
    await sendEmail({
      to: student.email,
      ...template
    });
    
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort('-createdAt');
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAsPaid = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { status: 'Paid' },
      { new: true }
    );
    
    const template = emailTemplates.paymentConfirmed(student.name);
    await sendEmail({
      to: student.email,
      ...template
    });
    
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.selectBatch = async (req, res) => {
  try {
    const { batch, joining_date } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { batch, joining_date },
      { new: true }
    );
    
    const template = emailTemplates.batchConfirmed(
      student.name,
      batch,
      new Date(joining_date).toLocaleDateString()
    );
    await sendEmail({
      to: student.email,
      ...template
    });
    
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};