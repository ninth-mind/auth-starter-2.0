const express = require('express')
const Mailer = require('../services/mail')
const { handleError } = require('../lib/utils')
const { verifyAuthenticationToken } = require('../lib/middleware')
const MailRouter = express.Router()
/**
 * Sends email confirmation if the user requests another confirmation email.
 * Used if their email confirmation token has expired.
 */
MailRouter.post(
  '/email-confirmation',
  verifyAuthenticationToken,
  (req, res) => {
    let { decodedToken } = req.locals
    Mailer.sendEmailConfirmation(decodedToken)
      .then(r => res.send('ok'))
      .catch(err => handleError(err, res, 1008))
  }
)

module.exports = MailRouter
