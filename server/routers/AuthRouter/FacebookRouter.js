const express = require('express')
const FacebookRouter = express.Router()
const passport = require('passport')
const FacebookStrategy = require('passport-facebook')
const um = require('../../database/userManagement')
const { handleError, respondWithToken } = require('../../lib/utils')

passport.serializeUser(function(user, done) {
  done(null, user)
})

passport.deserializeUser(function(user, done) {
  done(null, user)
})

FacebookRouter.use(passport.initialize())

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: 'http://localhost:3000/api/auth/facebook/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      //gets user from spotify and passes it to /spotify/callback
      let obj = { accessToken, refreshToken, profile }
      return done(null, obj)
    }
  )
)

FacebookRouter.get(
  '/',
  passport.authenticate('facebook', {
    failureRedirect: 'http://localhost:3000/404'
  })
)

FacebookRouter.get(
  '/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/login',
    session: false
  }),
  (req, res) => {
    const { profile } = req.user
    um.findOrCreateUser('facebook', profile, res)
      .then(user => respondWithToken(user, res, true))
      .catch(err => handleError(err, res, 1003))
  }
)

module.exports = FacebookRouter
