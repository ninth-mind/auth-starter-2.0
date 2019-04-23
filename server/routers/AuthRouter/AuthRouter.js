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
  User.findUser('email', req.body)
    .then(u => {
      if (u) respond(res, 409, 'User already exists')
      else {
        User.createUser('email', req.body).then(nu => respondWithToken(res, nu))
      }
    })
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
        if (err || !isMatch) respond(res, 403, 'Incorrect Password')
        else respondWithToken(res, user)
      })
    }
  })
})

AuthRouter.post('/complete-profile', verifyCaptcha, (req, res) => {
  const { source, id, email } = req.body
  User.findOneAndUpdate(
    source,
    { id, email },
    { ...req.body, permissions: ['view_profile'] },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(user => {
      if (!user) respond(res, 404, 'No user found')
      else respondWithToken(res, user)
    })
    .catch(err => {
      if (err.errors.email.kind === 'unique-validator')
        respond(res, 409, 'Email already exists')
      else respond(res, 500, 'Something went wrong')
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
