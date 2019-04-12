const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')
const cookieName = process.env.COOKIE_NAME
// const transporter = require('../connections/mailer')
const errorCodes = require('../lib/errorCodes')
const {
  passport,
  verifyAuthenticationToken,
  verifyCaptcha
} = require('../lib/middleware')
const {
  handleError,
  respondWithToken,
  sendEmailConfirmation,
  respond
} = require('../lib/utils')
const emailTemplates = require('../lib/emailTemplates')
const AuthRouter = express.Router()

const secret = process.env.SECRET
const tokenExpirationTime = process.env.TOKEN_EXPIRATION_TIME
const emailConfirmationTokenExpiration =
  process.env.EMAIL_CONFIRMATION_TOKEN_EXPIRATION
const clientURL = process.env.CLIENT_URL
const serverURL = process.env.SERVER_URL

/**
 * Verifies the users token is valid, and that the route
 * they are trying to access is allowed.
 */
AuthRouter.get('/', verifyAuthenticationToken, (req, res) => {
  // if the user makes it here.... they are authenticated
  return res.send('OK')
})

/**
 * Signs up user. Posts user data from form submission to database,
 * and triggers an email confirmation message to be sent to the users
 * email.
 */
AuthRouter.post('/register', verifyCaptcha, (req, res) => {
  User.create(req.body, (err, user) => {
    if (err) {
      if (err.code === 11000) {
        return res.status(409).send('This email already exists')
      } else return handleError(err, res, 1000)
    } else {
      // sendEmailConfirmation(user)
      //   .then(r => {
      respondWithToken(user, res)
      //     console.log('confirmation email sent')
      //   })
      //   .catch(err => handleError(err, null, 1001))
    }
  })
})

AuthRouter.post('/login', verifyCaptcha, (req, res) => {
  const { email, password } = req.body
  return User.findOne({ email })
    .then(user => {
      if (!user) respond(res, 403, errorCodes[1016])
      user.comparePassword(password, (err, isMatch) => {
        if (err) return handleError(err, res, 1002)
        if (!isMatch) {
          return respond(res, 401, 'Incorrect Password')
        }
        respondWithToken(user, res)
      })
    })
    .catch(err => handleError(err, null, 1000))
})

/**
 * LOGOUT
 */
AuthRouter.get('/logout', verifyAuthenticationToken, (req, res) => {
  res.clearCookie(cookieName)
  respond(res, 200, 'Successfully logged out')
})

/**
 * Changes users email and sends email confirmation to their new email.
 * Decodes token and checks to see if their email has been confirmed before
 * changing email.
 */
AuthRouter.post('/change-email', verifyAuthenticationToken, (req, res) => {
  let { decodedToken } = req.locals
  // check to see if their email is confirmed
  if (!decodedToken.emailConfirmed) {
    return res.status(403).send('Please confirm your email.')
  }

  // find user and update
  User.findOneAndUpdate(
    { email: decodedToken.email },
    // ^^ what to look for
    { $set: { email: req.body.email, emailConfirmed: false } },
    // ^^ what to update with
    { new: true },
    // ^^ return the new document
    (err, updatedUser) => {
      if (err) handleError(err, res, 1003)
      else {
        // send new updated token back
        respondWithToken(updatedUser, res)

        // send confirmation to new email
        sendEmailConfirmation(updatedUser)
          .then(r => console.log(r))
          .catch(err => handleError(err, null, 1004))
      }
    }
  )
})

/**
 * Changes their password, after verifying their existing password
 * and that their email has been confirmed.
 */
AuthRouter.post('/change-password', verifyAuthenticationToken, (req, res) => {
  let { decodedToken } = req.locals
  if (!decodedToken.emailConfirmed) {
    return res.status(401).send('Please confirm your email.')
  }

  User.findOne({ email: decodedToken.email }, (err, user) => {
    if (err) return handleError(err, res, 1005)
    else if (!user) return res.status(400).send('User not found')
    else {
      user.comparePassword(req.body['current-password'], (err, isMatch) => {
        if (err) return handleError(err, res, 1006)
        else if (!isMatch) return res.status(401).send('Incorrect password')
        else {
          // save the password and send refreshed token
          user.password = req.body['new-password']
          user.save((err, updatedUser) => {
            if (err || !updatedUser) return handleError(err, res, 1007)
            else return respondWithToken(updatedUser, res)
          })
        }
      })
    }
  })
})

/**
 * Sends email confirmation if the user requests another confirmation email.
 * Used if their email confirmation token has expired.
 */
AuthRouter.post(
  '/email-confirmation',
  verifyAuthenticationToken,
  (req, res) => {
    let { decodedToken } = req.locals
    sendEmailConfirmation(decodedToken)
      .then(r => res.send('ok'))
      .catch(err => handleError(err, res, 1008))
  }
)

/**
 * Confirms users email, once they have been re-routed back using the
 * confirmation email link sent to their email.
 */
AuthRouter.get('/email-confirmation/:token', (req, res) => {
  let { token } = req.params
  if (!token) {
    res.status(400).send('No token authorization token found to cofirm email.')
  } else {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        if (err.message === 'invalid token') {
          res.status(403).send('Invalid Token')
        } else if (err.message === 'jwt expired') {
          res.redirect(`${clientURL}/error`)
        } else return handleError(err, res, 1009)
      } else {
        User.findOneAndUpdate(
          { email: decoded.email },
          { $set: { emailConfirmed: true } },
          { new: true },
          (err, updatedUser) => {
            if (err) return handleError(err, res, 1010)
            // sign and send new confirmed email token back
            let { email, fname, lname, id, emailConfirmed } = updatedUser
            const signedToken = jwt.sign(
              { email, fname, lname, id, emailConfirmed },
              secret,
              {
                expiresIn: tokenExpirationTime
              }
            )
            res.redirect(`${clientURL}/token/${signedToken}`)
          }
        )
      }
    })
  }
})

/**
 *  Handles user posting of email information.
 *  Sends email if user is found with password reset link.
 *
 */
AuthRouter.post('/reset-password/', (req, res) => {
  let { email } = req.body

  User.findOne({ email }, (err, user) => {
    if (err) handleError(err, res, 1011)
    else if (!user) {
      // sends email telling user of password reset attempt on
      // null email
      console.log('SHOULD SEND EMAIL HERE')
      // transporter
      //   .sendMail({
      //     to: email,
      //     subject: 'Password Reset',
      //     html: emailTemplates.userNotFoundHTML(email),
      //     text: emailTemplates.userNotFoundText(email)
      //   })
      //   .then(r => {
      //     res.send('Email sent.')
      //   })
      //   .catch(err => handleError(err, null, 1012))
    } else if (!user.emailConfirmed) {
      res.status(401).send('Email was not confirmed.')
    } else {
      // sends email with reset link
      const { email, fname, lname, id, emailConfirmed } = user
      const signedToken = jwt.sign(
        { email, fname, lname, id, emailConfirmed },
        secret,
        {
          expiresIn: emailConfirmationTokenExpiration
        }
      )
      const link = `${serverURL}/api/auth/reset-password/${signedToken}`
      console.log('SHOULD SEND EMAIL HERE', link)
      // transporter
      //   .sendMail({
      //     to: email,
      //     subject: 'Password Reset',
      //     html: emailTemplates.resetPasswordHTML(email, link),
      //     text: emailTemplates.resetPasswordText(email, link)
      //   })
      //   .then(r => res.send('Email sent.'))
      //   .catch(err => handleError(err, null, 1012))
    }
  })
})

/**
 * Resets users password.
 * Fetches user from the database, and updates users password.
 */
AuthRouter.get('/reset-password/:token', (req, res) => {
  const { token } = req.params
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).send('Your link has expired.')
      } else return handleError(err, res, 'Error verifying token in middleware')
    } else {
      res.redirect(`${clientURL}/reset-password/${token}`)
    }
  })
})

AuthRouter.put('/reset-password', verifyAuthenticationToken, (req, res) => {
  const { decodedToken } = req.locals
  User.findOne({ email: decodedToken.email }, (err, user) => {
    if (err) return handleError(err, res, 1013)
    else if (!user) return res.status(401).send('No user found.')
    else {
      user.password = req.body['new-password']
      user.save((err, updatedUser) => {
        if (err || !updatedUser) return handleError(err, res, 1015)
        else return respondWithToken(updatedUser, res)
      })
    }
  })
})

module.exports = AuthRouter
