const moment = require('moment')
/* eslint-disable */
function confirmationEmailHTML(email, linkWithToken) {
  return `
<!DOCTYPE html>
<html lang="en">
<body>
  <h1>Confirm your email address</h1>
  <p>Hello! We just need to verify that <strong>${email}</strong> is your email address. This will help us in the future to verify your identity.</p>
  <p>Note: This process should be done within 10 minutes of ${moment().format(
    'MMMM Do YYYY, h:mm a'
  )}, otherwise you will need to request another verification email.</p>
  <a href=${linkWithToken}>Confirm Email Address</a>
  <br/>
  <strong>Didn't request this email?</strong>
  <p>No worries! Your email address was entered by mistake. Ignore this and you wont recieve any more emails.</p>

</body>
</html>
`
}

function confirmationEmailText(email, linkWithToken) {
  return `
  Confirm your email address
  Hello! We just need to verify that ${email} is your email address. This will help us in the future to verify your identity.
  Note: This process should be done within 10 minutes of ${moment().format(
    'MMMM Do YYYY, h:mm a'
  )}, otherwise you will need to request another verification email.
  Please copy paste this link into your browser to confirm your email:

  ${linkWithToken}

  Didn't request this email?
  No worries! Your email address was entered by mistake. Ignore this and you wont recieve any more emails.`
}

function resetPasswordText(email, linkWithToken) {
  return `
  Please click the link below to reset your password.

  ${linkWithToken}

  If you did not request this email, please ignore it.
  `
}

function resetPasswordHTML(email, linkWithToken) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <body>

  <h1>Password Reset</h1>
  <p>Please click the link below to reset your password. </p>

  <a href=${linkWithToken}>Password Reset</a>

  <p>If you did not request this email, please ignore it.</p>

  </body>
  </html>
  `
}

function userNotFoundHTML(email) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <body>

  <h1>Email Not Found</h1>
  <p>Someone has requested to reset their password for ${email}. If that person was you, we were unable to find any user with that email. Perhaps you used a different email during registration.</p>
  <p>If that person wasn't you, no further action is required. We will not reset your password or email without your explicit consent from the email we have on file.</p>

  </body>
  </html>
  `
}

function userNotFoundText(email) {
  return `Email Not Found

  Someone has requested to reset their password for ${email}. If that person was you, we were unable to find any user with that email. Perhaps you used a different email during registration.

  If that person wasn't you, no further action is required. We will not reset your password or email without your explicit consent from the email we have on file.
  `
}

/* eslint-enable */

module.exports = {
  confirmationEmailHTML,
  confirmationEmailText,
  resetPasswordHTML,
  resetPasswordText,
  userNotFoundHTML,
  userNotFoundText
}
