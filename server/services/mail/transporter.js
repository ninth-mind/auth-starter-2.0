const nodemailer = require('nodemailer')
const {
  emailUsername,
  emailPassword,
  emailHost
} = require('../../config').email

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
