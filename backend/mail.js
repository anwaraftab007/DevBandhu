//mlsz lgwg kqvu fsgm


//const nodemailer = require('nodemailer');
import nodemailer from 'nodemailer'
// Create a transporter object using SMTP with Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'anupambhosle38@gmail.com', // Your Gmail address
    pass: 'rfcf qrhb uvlp famb',    // The app password generated in Step 1
  },
});

// Mail options
const mailOptions = {
  from: 'amazon+101@gmail.com',         // Sender's email address
  to: 'anwaraftab007@gmail.com',          // Recipient's email address
  subject: 'Test Email from Node.js',   // Email subject
  text: 'This is a test email sent from Node.js using Gmail!', // Plain text body
  html: '<h1>Hello!</h1><p>This is a test email sent from Node.js using Gmail!</p>', // HTML body
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Email sent successfully:', info.response);
  }
});
