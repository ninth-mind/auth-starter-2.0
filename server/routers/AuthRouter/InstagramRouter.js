const express = require('express')
const { passport } = require('../../lib/middleware')
const InstagramRouter = express.Router()
const InstagramStrategy = require('passport-instagram')
const User = require('../../services/user')
const { handleError, createToken, setCookie } = require('../../lib/utils')
const config = require('../../config')
const { clientSecret, clientID } = config.instagram
const { serverURL, clientURL } = config.global

/**
 * Configure the strategies
 */
passport.use(
  'instagram-login-strategy',
  new InstagramStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: `${serverURL}/api/auth/instagram/login/callback`
    },
    (accessToken, refreshToken, profile, done) => {
      let obj = { accessToken, refreshToken, profile }
      return done(null, obj)
    }
  )
)

passport.use(
  'instagram-register-strategy',
  new InstagramStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: `${serverURL}/api/auth/instagram/register/callback`
    },
    (accessToken, refreshToken, profile, done) => {
      let obj = { accessToken, refreshToken, profile }
      return done(null, obj)
    }
  )
)

/**
 * set the routes
 */
InstagramRouter.get(
  '/register',
  passport.authenticate('instagram-register-strategy', {
    failureRedirect: `${clientURL}/c`,
    session: false,
    showDialog: true
  })
)

InstagramRouter.get(
  '/login',
  passport.authenticate('instagram-login-strategy', {
    failureRedirect: `${clientURL}/c`,
    session: false,
    showDialog: true
  })
)

/**
 * callback routes
 */
InstagramRouter.get(
  '/register/callback',
  passport.authenticate('instagram-register-strategy', {
    failureRedirect: '/c'
  }),
  async (req, res) => {
    try {
      const { profile } = req.user
      let user = await User.findUser('instagram', profile)
      // if user is found, log them in and redirect to profile
      if (user) {
        let token = createToken(user.toObject())
        setCookie(res, token, true, false)
        res.redirect('/u/profile')
        // if NO user, create temp token and redirect to complete-profile page
      } else {
        let newProf = User.loginMapper('instagram', profile)
        let token = createToken(newProf, true)
        setCookie(res, token, true, false)
        res.redirect(`/c/complete-profile?token=${token}`)
      }
    } catch (err) {
      handleError(err, res, 1003)
    }
  }
)

InstagramRouter.get(
  '/login/callback',
  passport.authenticate('instagram-login-strategy', {
    failureRedirect: '/c'
  }),
  async (req, res) => {
    try {
      const { profile } = req.user
      let user = await User.findUser('instagram', profile)
      // if user is found, log them in and redirect to profile
      if (user) {
        let token = createToken(user.toObject())
        setCookie(res, token, true, false)
        // respond(res, 200, 'User found. Logging in', { token })
        res.redirect('/u/profile')

        // if NO user, create temp token and redirect to complete-profile page
      } else {
        res.redirect(
          `/c/login?login-attempt=instagram&username=${profile.username}`
        )
      }
    } catch (err) {
      handleError(err, res, 1003)
    }
  }
)

module.exports = InstagramRouter
