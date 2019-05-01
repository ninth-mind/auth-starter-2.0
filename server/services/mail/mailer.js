const transporter = require('./transporter')
const templates = require('./emailTemplates')
const serverURL = process.env.SERVER_URL
/**
 * Sends email confirmation link to users email.
 * @param {string} email : Users email
 * @param {string} token : Temporary token to send
 */
async function sendEmailConfirmation(email, token) {
  try {
    let link = `${serverURL}/api/auth/email-confirmation/${token}`
    let result = await transporter.sendMail({
      to: email,
      subject: 'Confirmation Email',
      html: templates.confirmationEmailHTML(email, link)
    })

    console.log('EMAIL RESULT', result)
    return result
  } catch (err) {
    return err
  }
}

async function sendPasswordChangeEmail(email, token) {
  try {
    let link = `${serverURL}/api/auth/reset-password/${token}`
    let result = await transporter.sendMail({
      to: email,
      subject: 'Password Change Request',
      html: templates.resetPasswordHTML(email, link)
    })
    return result
  } catch (err) {
    return err
  }
}

async function sendNoUserFoundEmail(email) {
  try {
    let result = await transporter.sendMail({
      to: email,
      subject: 'Account Change Request',
      html: templates.userNotFoundHTML(email)
    })
    return result
  } catch (err) {
    return err
  }
}

module.exports = {
  sendEmailConfirmation,
  sendPasswordChangeEmail,
  sendNoUserFoundEmail
}
