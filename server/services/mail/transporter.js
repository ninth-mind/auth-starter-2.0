const nodemailer = require('nodemailer')
const emailUsername = process.env.EMAIL_USERNAME
const emailPassword = process.env.EMAIL_PASSWORD
const emailHost = process.env.EMAIL_HOST

const smtpConfig = {
  // service: 'Godaddy',
  host: emailHost,
  secure: false,
  port: 587,
  auth: {
    user: emailUsername,
    pass: emailPassword
  }
}

const emailDefaults = {
  from: emailUsername,
  subject: 'TEST EMAIL MESSAGE'
}

const transporter = nodemailer.createTransport(smtpConfig, emailDefaults)

module.exports = transporter
