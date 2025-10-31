const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const studentRoutes = require('./routes/studentRoutes');
const Student = require('./models/student');
const { sendEmail, emailTemplates } = require('./utils/emailService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', studentRoutes);

// Cron Jobs
// Check for pending registrations every day at 10 AM
cron.schedule('0 10 * * *', async () => {
  try {
    const fourDaysAgo = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000);
    const pendingStudents = await Student.find({
      status: 'Pending',
      createdAt: { $lte: fourDaysAgo }
    });

    for (const student of pendingStudents) {
      const template = emailTemplates.reminder(student.name);
      await sendEmail({
        to: student.email,
        ...template
      });
    }
  } catch (error) {
    console.error('Reminder cron job error:', error);
  }
});

// Check for upcoming joining dates every day at 9 AM
cron.schedule('0 9 * * *', async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const joiningStudents = await Student.find({
      status: 'Paid',
      joining_date: {
        $gte: tomorrow,
        $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    for (const student of joiningStudents) {
      const template = emailTemplates.dashboardAccess(
        student.name,
        student.joining_date.toLocaleDateString()
      );
      await sendEmail({
        to: student.email,
        ...template
      });
      
      await Student.findByIdAndUpdate(student._id, { status: 'Joined' });
    }
  } catch (error) {
    console.error('Pre-joining cron job error:', error);
  }
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});