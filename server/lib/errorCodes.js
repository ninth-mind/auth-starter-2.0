module.exports = {
  // AuthRouter
  1000: 'Error finding user during login',
  1001: 'Error finding user during profile lookup',
  1002: 'Error checking password during login',
  1005: 'Error fetching user during password change.',
  1006: 'Error when checking passwords during password change',
  1007: 'Error saving updated user when changing passwords.',
  1008: 'Error sending email confirmation during email confirmation re-request.',
  1009: 'Error verifying token during email confirmation.',
  1010: 'Error finding and updating user during email confirmation.',
  1011: 'Error finding user during password reset.',
  1012: 'Error with transporter sending reset password email.',
  1013: 'Error fetching user during password reset',
  1014: 'Error checking password during password reset',
  1015: 'Error saving updated user and password during password reset.',
  1016: 'Error looking up user during basic authentication',

  // UserRouter
  2000: 'Error fetching user data for profile.',
  2001: 'Error saving quiz scores to user.',
  2002: 'Error fetching saved quiz scores',
  2003: 'Error fetching saved quiz results',

  // ActionsRouter
  3000: 'Error sending results email.',

  // Middleware
  4000: 'Error verifying token in middleware',
  4001: 'Error posting to Google Captcha service.',

  // ADMIN
  5000: 'Error creating organization.',
  5001: 'Error sending organization email',

  //PhoneRouter
  6000: 'Error fetching user in phone',
  6002: 'Eroor saving new user',

  7000: 'Error finding number for recording',
  7001: 'Error saving recording'
}
