const express = require('express')
const { passport } = require('../../lib/middleware')
const User = require('../../services/user')
const Mailer = require('../../services/mail')
const InstagramRouter = require('./InstagramRouter')
const FacebookRouter = require('./FacebookRouter')
const {
  verifyAuthenticationToken,
  verifyCaptcha
} = require('../../lib/middleware')
const { handleError, respond, createToken } = require('../../lib/utils')
const cookieName = process.env.COOKIE_NAME
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
AuthRouter.post('/register', verifyCaptcha, async (req, res) => {
  try {
    let u = await User.findUser('email', req.body)
    if (u) respond(res, 409, 'User already exists')
    else {
      // create user
      let nu = await User.createUser('email', req.body)
      let token = createToken(nu.toObject(), true)
      //send confirmation email
      let mailResponse = await Mailer.sendEmailConfirmation(nu.email, token)
      respond(res, 200, 'email confirmation sent', mailResponse)
    }
  } catch (err) {
    handleError(err, res, 1003)
  }
})

AuthRouter.post('/login', verifyCaptcha, async (req, res) => {
  try {
    const { email, password } = req.body
    let u = await User.findUser('email', { email })
    if (!u) respond(res, 404, 'No user found')
    else {
      if (!u.password) return respond(res, 409, `User signed using ${u.source}`)
      let isMatch = await u.comparePassword(password)
      if (!isMatch) respond(res, 403, 'Incorrect credentials')
      else {
        let token = createToken(u.toObject())
        res.cookie(cookieName, token, { httpOnly: true })
        respond(res, 200, 'login successful', u.toObject())
      }
    }
  } catch (err) {
    handleError(err, res, 1004)
  }
})

AuthRouter.post(
  '/complete-profile',
  verifyCaptcha,
  verifyAuthenticationToken,
  async (req, res) => {
    try {
      //create user
      const { source, email } = req.body
      let u = await User.findOrCreateUser(
        source,
        { ...req.body },
        { new: true }
      )
      //create new temporary token
      let token = createToken(u.toObject(), true)
      let mailResponse = await Mailer.sendEmailConfirmation(email, token)
      respond(res, 200, 'email confirmation sent', mailResponse)
    } catch (err) {
      if (err.errors) {
        let kind = err.errors.keys()[0]
        return respond(res, 409, `${kind} already exists.`)
      } else handleError(err, res, 1005)
    }
  }
)

/**
 * LOGOUT
 */
AuthRouter.get('/logout', verifyAuthenticationToken, (req, res) => {
  res.clearCookie(cookieName)
  respond(res, 200, 'Successfully logged out')
})

/**
 * Confirms users email, once they have been re-routed back using the
 * confirmation email link sent to their email.
 */
AuthRouter.get(
  '/email-confirmation/:token',
  verifyAuthenticationToken,
  async (req, res) => {
    try {
      let { decodedToken } = req.locals
      let u = await User.findOneAndUpdate(
        decodedToken.source,
        decodedToken,
        { $set: { confirmed: true, permissions: ['view_profile'] } },
        { new: true }
      )
      let newToken = createToken(u.toObject())
      res.cookie(cookieName, newToken, { httpOnly: true, overwrite: true })
      res.redirect('/u')
    } catch (err) {
      handleError(err, res, 1006)
    }
  }
)

module.exports = AuthRouter
