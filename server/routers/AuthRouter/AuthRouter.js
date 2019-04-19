const express = require('express')
const { passport } = require('../../lib/middleware')
const User = require('../../services/user')
const InstagramRouter = require('./InstagramRouter')
const FacebookRouter = require('./FacebookRouter')
const cookieName = process.env.COOKIE_NAME

const {
  verifyAuthenticationToken,
  verifyCaptcha
} = require('../../lib/middleware')
const { handleError, respondWithToken, respond } = require('../../lib/utils')
const AuthRouter = express.Router()

AuthRouter.use(passport.initialize())
AuthRouter.use('/instagram', InstagramRouter)
AuthRouter.use('/facebook', FacebookRouter)

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
  User.findOrCreateUser('email', req.body)
    .then(user => respondWithToken(user, res, true))
    .catch(err => {
      if (err.code === 11000) {
        res.status(409).send('This email already exists')
      } else handleError(err, res, 1000)
    })
})

AuthRouter.post('/login', verifyCaptcha, (req, res) => {
  const { email, password } = req.body
  User.findUser('email', { email }).then(user => {
    if (!user) respond(res, 404, 'No user found')
    else {
      user.comparePassword(password, (err, isMatch) => {
        if (err) handleError(err, res, 1002)
        else if (!isMatch) respond(res, 403, 'Incorrect Password')
        else respondWithToken(user, res, true)
      })
    }
  })
})

/**
 * LOGOUT
 */
AuthRouter.get('/logout', verifyAuthenticationToken, (req, res) => {
  res.clearCookie(cookieName)
  respond(res, 200, 'Successfully logged out')
})

module.exports = AuthRouter
