const express = require('express')
const { passport } = require('../../lib/middleware')
const User = require('../../services/user')
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
      let token = createToken(nu.toObject())
      res.cookie(cookieName, token, { httpOnly: true })
      respond(res, 200, 'User created', { ...nu, wasNew: nu.wasNew, token })
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
      const { source } = req.body
      let u = await User.findOrCreateUser(
        source,
        { ...req.body },
        { new: true }
      )
      let token = createToken(u.toObject())
      res.cookie(cookieName, token, { httpOnly: true, overwrite: true })
      respond(res, 200, 'user saved', u)
    } catch (err) {
      if (err.errors && err.errors.email.kind === 'unique-validator')
        return respond(res, 409, `Email already exists.`)
      else handleError(err, res, 1005)
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

module.exports = AuthRouter
