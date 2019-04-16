const express = require('express')
const InstagramRouter = express.Router()
const passport = require('passport')
const InstagramStrategy = require('passport-instagram')
const um = require('../../database/userManagement')
const { handleError, respondWithToken } = require('../../lib/utils')

passport.serializeUser(function(user, done) {
  done(null, user)
})

passport.deserializeUser(function(user, done) {
  done(null, user)
})

InstagramRouter.use(passport.initialize())

passport.use(
  new InstagramStrategy(
    {
      clientID: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/api/auth/instagram/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      //gets user from spotify and passes it to /spotify/callback
      let obj = { accessToken, refreshToken, profile }
      return done(null, obj)
    }
  )
)

InstagramRouter.get(
  '/',
  passport.authenticate('instagram', {
    failureRedirect: 'http://localhost:3000/404'
  })
)

InstagramRouter.get(
  '/callback',
  passport.authenticate('instagram', {
    failureRedirect: '/login',
    session: false
  }),
  (req, res) => {
    const { profile } = req.user
    um.findOrCreateUser('instagram', profile, res)
      .then(user => respondWithToken(user, res, true))
      .catch(err => handleError(err, res, 1003))
  }
)

module.exports = InstagramRouter
