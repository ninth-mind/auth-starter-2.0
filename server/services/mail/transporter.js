const nodemailer = require('nodemailer')
const {
  emailUsername,
  googleAccount,
  googleEmailClientID,
  googleEmailClientSecret,
  googleEmailRefreshToken,
  googleEmailAccessToken
} = require('../../config').email

/**
 * I am using Google Emails here. You can use another service.
 * Check the README to see how to setup google emails using nodemailer
 */

const smtpConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: googleAccount,
    clientId: googleEmailClientID,
    clientSecret: googleEmailClientSecret,
    refreshToken: googleEmailRefreshToken,
    accessToken: googleEmailAccessToken
  }
}

const emailDefaults = {
  from: emailUsername, // in my case, my email user is different than account name
  subject: 'TEST EMAIL MESSAGE'
}

const transporter = nodemailer.createTransport(smtpConfig, emailDefaults)

module.exports = transporter
