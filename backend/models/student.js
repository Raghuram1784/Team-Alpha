const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  course: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Joined'],
    default: 'Pending'
  },
  batch: {
    type: String,
    default: null
  },
  joining_date: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Student', studentSchema);