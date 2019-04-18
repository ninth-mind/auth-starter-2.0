const express = require('express')
const { passport } = require('../../lib/middleware')
const InstagramRouter = express.Router()
const InstagramStrategy = require('passport-instagram')
const User = require('../../services/user')
const { handleError, respondWithToken } = require('../../lib/utils')
const serverURL = process.env.SERVER_URL
const clientURL = process.env.CLIENT_URL

passport.use(
  new InstagramStrategy(
    {
      clientID: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      callbackURL: `${serverURL}/api/auth/instagram/callback`
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
    failureRedirect: `${clientURL}/404`
  })
)

InstagramRouter.get(
  '/callback',
  passport.authenticate('instagram', {
    failureRedirect: '/c',
    session: false,
    showDialog: true
  }),
  (req, res) => {
    const { profile } = req.user
    User.findOrCreateUser('instagram', profile, res)
      .then(user => respondWithToken(user, res, true))
      .catch(err => handleError(err, res, 1003))
  }
)

module.exports = InstagramRouter
