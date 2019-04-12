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

function resultsEmailText(fname, lname, message, results) {
  return `${fname.toUpperCase()} ${lname.toUpperCase()} would like to share their PIP results with you. Here is what they had to say:

      ${message}

      Overall: ${results.total},
      PIP: ${results.pip},
      Obstacles: ${results.obstacles},
      Flexibility: ${results.flexibility},
      Engagement: ${results.engagement}
    `
}

function resultsEmailHTML(fname, lname, message, results) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <body>
    <h1>PIP Results:</h1>
    <p>${fname.toUpperCase()} ${lname.toUpperCase()} would like to share their PIP results with you. Here is what they had to say:</p>

    <blockquote>"${message}"</blockquote>

    <ul>
      <li>Overall: ${results.total}</li>
      <li>PIP: ${results.pip}</li>
      <li>Obstacles: ${results.obstacles}</li>
      <li>Flexibility: ${results.flexibility}</li>
      <li>Engagement: ${results.engagement}</li>
    </ul>
  </body>
  </html>
  `
}

function teamBuilderEmailHTML(fname, lname, message, data) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <body>
  <p>${fname.toUpperCase()} ${lname.toUpperCase()} would like to share their Caregiver Team Builder with you. ${
    message ? `Here is what they had to say:` : ''
  }</p>
  ${message ? `<blockquote>"${message}"</blockquote>` : ''}

  <h1>Caregiver Team Builder</h1>
  <table>
  <tbody>
  <tr>
    <th></th>
    <th>Who</th>
    <th>How They Help</th>
    <th>Contact Info</th>
  </tr>
  <tr>
    <td><strong>Family Members</strong></td>
    <td id="who-family"/>${data.who['family']}</td>
    <td id="how-family"/>${data.how['family']}</td>
    <td id="contact-family"/>${data.contact['family']}</td>
  </tr>
  <tr>
      <td><strong>MD &amp; Specialist</strong></td>
      <td id="who-specialist"/>${data.who['specialist']}</td>
      <td id="how-specialist"/>${data.how['specialist']}</td>
      <td id="contact-specialist"/>${data.contact['specialist']}</td>
  </tr>
  <tr>
    <td><strong>Nurses</strong></td>
    <td id="who-nurses"/>${data.who['nurses']}</td>
    <td id="how-nurses"/>${data.how['nurses']}</td>
    <td id="contact-nurses"/>${data.contact['nurses']}</td>
  </tr>
  <tr>
    <td><strong>Patient Advocacy: Broker-Friends</strong></td>
    <td id="who-advocate"/>${data.who['advocate']}</td>
    <td id="how-advocate"/>${data.how['advocate']}</td>
    <td id="contact-advocate"/>${data.contact['advocate']}</td>
  </tr>
  <tr>
    <td><strong>Complementary Medicine Provider</strong></td>
    <td id="who-complementary"/>${data.who['complementary']}</td>
    <td id="how-complementary"/>${data.how['complementary']}</td>
    <td id="contact-complementary"/>${data.contact['complementary']}</td>
  </tr>
  <tr>
    <td><strong>Wellness Coach</strong></td>
    <td id="who-coach"/>${data.who['coach']}</td>
    <td id="how-coach"/>${data.how['coach']}</td>
    <td id="contact-coach"/>${data.contact['coach']}</td>
  </tr>
  <tr>
    <td><strong>Pharmacist</strong></td>
    <td id="who-pharmacist"/>${data.who['pharmacist']}</td>
    <td id="how-pharmacist"/>${data.how['pharmacist']}</td>
    <td id="contact-pharmacist"/>${data.contact['pharmacist']}</td>
  </tr>
  <tr>
    <td><strong>Fitness Instructor</strong></td>
    <td id="who-fitness"/>${data.who['fitness']}</td>
    <td id="how-fitness"/>${data.how['fitness']}</td>
    <td id="contact-fitness"/>${data.contact['fitness']}</td>
  </tr>
  <tr>
    <td><strong>Co-workers</strong></td>
    <td id="who-workers"/>${data.who['workers']}</td>
    <td id="how-workers"/>${data.how['workers']}</td>
    <td id="contact-workers"/>${data.contact['workers']}</td>
  </tr>
  <tr>
    <td><strong>Insurance Carrier</strong></td>
    <td id="who-insurance"/>${data.who['insurance']}</td>
    <td id="how-insurance"/>${data.how['insurance']}</td>
    <td id="contact-insurance"/>${data.contact['insurance']}</td>
  </tr>
  <tr>
    <td><strong>EAP Provider</strong></td>
    <td id="who-eap"/>${data.who['eap']}</td>
    <td id="how-eap"/>${data.how['eap']}</td>
    <td id="contact-eap"/>${data.contact['eap']}</td>
  </tr>
  <tr>
    <td><strong>Price Shopping Service</strong></td>
    <td id="who-shopper"/>${data.who['shopper']}</td>
    <td id="how-shopper"/>${data.how['shopper']}</td>
    <td id="contact-shopper"/>${data.contact['shopper']}</td>
  </tr>
  <tr>
    <td><strong>HSA/FSA/HRA: Vendor TPA</strong></td>
    <td id="who-vendor"/>${data.who['vendor']}</td>
    <td id="how-vendor"/>${data.how['vendor']}</td>
    <td id="contact-vendor"/>${data.contact['vendor']}</td>
  </tr>
  <tr>
    <td><strong>Web-based Patient Communities</strong></td>
    <td id="who-web"/>${data.who['web']}</td>
    <td id="how-web"/>${data.how['web']}</td>
    <td id="contact-web"/>${data.contact['web']}</td>
  </tr>
  <tr>
    <td><strong>Other</strong></td>
    <td id="who-other"/>${data.who['other']}</td>
    <td id="how-other"/>${data.how['other']}</td>
    <td id="contact-other"/>${data.contact['other']}</td>
  </tr>
  </tbody>
  </table>
  </body>
  </html>
  `
}

function teamBuilderEmailText(fname, lname, message, data) {
  return `
  ${fname.toUpperCase()} ${lname.toUpperCase()} would like to share their Caregiver Team Builder with you. ${
    message ? `Here is what they had to say:` : ''
  }
  "${message ? `<blockquote>"${message}"</blockquote>` : ''}"

  Caregiver Team Builder!

  Family Members: ${data.who['family']}
  How they help: ${data.how['family']}
  Contact info: ${data.contact['family']}

  MD & Specialists: ${data.who['specialist']}
  How they help: ${data.how['specialist']}
  Contact info: ${data.contact['specialist']}

  Nurses: ${data.who['nurses']}
  How they help: -nurses"/>${data.how['nurses']}
  Contact info: ${data.contact['nurses']}

  Patient Advocacy: Broker-Friends: ${data.who['advocate']}
  How they help: ${data.how['advocate']}
  Contact info: ${data.contact['advocate']}

  Complementary Medicine Provider: ${data.who['complementary']}
  How they help: ${data.how['complementary']}
  Contact info: ${data.contact['complementary']}

  Wellness Coach: ${data.who['coach']}
  How they help: ${data.how['coach']}
  Contact info: ${data.contact['coach']}

  Pharmacist: ${data.who['pharmacist']}
  How they help: ${data.how['pharmacist']}
  Contact info: ${data.contact['pharmacist']}

  Fitness Instructor: ${data.who['fitness']}
  How they help: ${data.how['fitness']}
  Contact info: ${data.contact['fitness']}

  Co-workers: ${data.who['workers']}
  How they help: ${data.how['workers']}
  Contact info: ${data.contact['workers']}

  Insurance Carrier: ${data.who['insurance']}
  How they help: ${data.how['insurance']}
  Contact info: ${data.contact['insurance']}

  EAP Provider: ${data.who['eap']}
  How they help: ${data.how['eap']}
  Contact info: ${data.contact['eap']}

  Price Shopping Service: ${data.who['shopper']}
  How they help: ${data.how['shopper']}
  Contact info: ${data.contact['shopper']}

  HSA/FSA/HRA: Vendor TPA: ${data.who['vendor']}
  How they help: ${data.how['vendor']}
  Contact info: ${data.contact['vendor']}

  Web-based Patient Communities: ${data.who['web']}
  How they help: ${data.how['web']}
  Contact info: ${data.contact['web']}

  Other: ${data.who['other']}
  How they help: ${data.how['other']}
  Contact info: ${data.contact['other']}
  `
}

function organizationCreationEmailHTML(
  fname,
  lname,
  orgName,
  signupLink,
  confirmEmailLink
) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <body>
  <p>${fname.toUpperCase()} ${lname.toUpperCase()} has made you the admin of the organization: </p>
  <h1>${orgName}</h1>

  <p>
    If you are already a member with us, please click this link to confirm your email as the admin of ${orgName}
    <a href="${confirmEmailLink}">Already a Member</a>
  </p>
  <p>
    If you are not already a member with us, please use this signup link become the Organization's Admin <br/>
    ${signupLink}
  </p>

  </body>
  `
}
/* eslint-enable */

module.exports = {
  confirmationEmailHTML,
  confirmationEmailText,
  resetPasswordHTML,
  resetPasswordText,
  userNotFoundHTML,
  userNotFoundText,
  resultsEmailText,
  resultsEmailHTML,
  teamBuilderEmailHTML,
  teamBuilderEmailText,
  organizationCreationEmailHTML
}
