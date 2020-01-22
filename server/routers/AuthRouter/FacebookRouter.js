const express = require('express')
const FacebookRouter = express.Router()
const { passport } = require('../../lib/middleware')
const FacebookStrategy = require('passport-facebook')
const User = require('../../services/user')
const { handleError, createToken, setCookie } = require('../../lib/utils')
const config = require('../../config')
const { clientSecret, clientID } = config.facebook
const { serverURL, clientURL } = config.global

passport.use(
  'facebook-register-strategy',
  new FacebookStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: `${serverURL}/api/auth/facebook/register/callback`,
      profileFields: [
        'id',
        'displayName',
        'photos',
        'emails',
        'first_name',
        'last_name'
      ]
    },
    (accessToken, refreshToken, profile, done) => {
      //gets user from spotify and passes it to /spotify/callback
      let obj = { accessToken, refreshToken, profile }
      return done(null, obj)
    }
  )
)

passport.use(
  'facebook-login-strategy',
  new FacebookStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: `${serverURL}/api/auth/facebook/login/callback`,
      profileFields: [
        'id',
        'displayName',
        'photos',
        'emails',
        'first_name',
        'last_name'
      ]
    },
    (accessToken, refreshToken, profile, done) => {
      //gets user from spotify and passes it to /spotify/callback
      let obj = { accessToken, refreshToken, profile }
      return done(null, obj)
    }
  )
)

FacebookRouter.get(
  '/register',
  passport.authenticate('facebook-register-strategy', {
    failureRedirect: `${clientURL}/c`,
    session: false,
    showDialog: true,
    scope: ['public_profile', 'email']
  })
)

FacebookRouter.get(
  '/login',
  passport.authenticate('facebook-login-strategy', {
    failureRedirect: `${clientURL}/c`,
    session: false,
    showDialog: true,
    scope: ['public_profile', 'email']
  })
)

FacebookRouter.get(
  '/login/callback',
  passport.authenticate('facebook-login-strategy', {
    failureRedirect: '/c',
    scope: ['public_profile', 'email']
  }),
  async (req, res) => {
    try {
      const { profile } = req.user
      let user = await User.findUser('facebook', profile)
      // if user is found, log them in and redirect to profile
      if (user) {
        let token = createToken(user.toObject())
        setCookie(res, token, true, false)
        res.redirect('/u/profile')
        // if NO user, create temp token and redirect to complete-profile page
      } else {
        res.redirect(
          `/c/login?login-attempt=facebook&username=${profile.username}`
        )
      }
    } catch (err) {
      handleError(err, res, 1003)
    }
  }
)

FacebookRouter.get(
  '/register/callback',
  passport.authenticate('facebook-register-strategy', {
    failureRedirect: '/c',
    scope: ['public_profile', 'email']
  }),
  async (req, res) => {
    try {
      const { profile } = req.user
      let user = await User.findUser('facebook', profile)
      // if user is found, log them in and redirect to profile
      if (user) {
        let token = createToken(user.toObject())
        setCookie(res, token, true, false)
        res.redirect('/u/profile')
        // if NO user, create temp token and redirect to complete-profile page
      } else {
        let newProf = User.loginMapper('facebook', profile)
        let token = createToken(newProf, true)
        setCookie(res, token, true, false)
        res.redirect(`/c/complete-profile?token=${token}`)
      }
    } catch (err) {
      handleError(err, res, 1003)
    }
  }
)

module.exports = FacebookRouter
