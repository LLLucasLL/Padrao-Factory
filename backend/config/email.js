const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: String(process.env.EMAIL_SECURE).toLowerCase() === 'true',
  family: 4,
  connectionTimeout: Number(process.env.EMAIL_CONNECTION_TIMEOUT || 10000),
  greetingTimeout: Number(process.env.EMAIL_GREETING_TIMEOUT || 10000),
  socketTimeout: Number(process.env.EMAIL_SOCKET_TIMEOUT || 20000),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
