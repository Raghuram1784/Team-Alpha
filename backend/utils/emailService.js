const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, text }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log(`Email sent: ${subject} to ${to}`);
    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};

const emailTemplates = {
  registration: (name) => ({
    subject: 'Welcome to Our Program - Registration Confirmed',
    text: `Dear ${name},\n\nThank you for registering! Your application is being processed.\nWe'll notify you once your payment is confirmed.\n\nBest regards,\nTeam CRM`
  }),
  
  reminder: (name) => ({
    subject: 'Registration Payment Reminder',
    text: `Dear ${name},\n\nThis is a friendly reminder about completing your registration payment.\nPlease process it soon to secure your spot.\n\nBest regards,\nTeam CRM`
  }),
  
  paymentConfirmed: (name) => ({
    subject: 'Payment Confirmed - Select Your Batch',
    text: `Dear ${name},\n\nYour payment has been confirmed!\nPlease select your preferred batch timing at: http://localhost:3000/batch\n\nBest regards,\nTeam CRM`
  }),
  
  batchConfirmed: (name, batch, date) => ({
    subject: 'Batch Selection Confirmed',
    text: `Dear ${name},\n\nYour batch has been confirmed:\nBatch: ${batch}\nJoining Date: ${date}\n\nWe look forward to seeing you!\n\nBest regards,\nTeam CRM`
  }),
  
  dashboardAccess: (name, date) => ({
    subject: 'Your Course Dashboard Access',
    text: `Dear ${name},\n\nYour course begins tomorrow (${date})!\nAccess your dashboard at: http://localhost:3000/dashboard\n\nBest regards,\nTeam CRM`
  })
};

module.exports = {
  sendEmail,
  emailTemplates
};