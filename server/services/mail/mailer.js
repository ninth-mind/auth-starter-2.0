const transporter = require('./transporter')
const { confirmationEmailHTML } = require('./emailTemplates')
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
      html: confirmationEmailHTML(email, link)
    })
    if (result) {
      console.log('EMAIL RESULT', result)
      return result
    }
  } catch (err) {
    return err
  }
}

module.exports = {
  sendEmailConfirmation
}
