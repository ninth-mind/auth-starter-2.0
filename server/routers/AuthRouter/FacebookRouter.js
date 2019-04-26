const express = require('express')
const FacebookRouter = express.Router()
const { passport } = require('../../lib/middleware')
const FacebookStrategy = require('passport-facebook')
const User = require('../../services/user')
const { handleError, createToken } = require('../../lib/utils')
const serverURL = process.env.SERVER_URL
const clientURL = process.env.CLIENT_URL
const cookieName = process.env.COOKIE_NAME

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${serverURL}/api/auth/facebook/callback`
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
    failureRedirect: `${clientURL}/c`,
    session: false,
    showDialog: true,
    scope: ['email']
  })
)

FacebookRouter.get(
  '/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/c'
  }),
  async (req, res) => {
    try {
      const { profile } = req.user
      let user = await User.findUser('facebook', profile)
      // if user is found, log them in and redirect to profile
      if (user) {
        let token = createToken(user.toObject())
        res.cookie(cookieName, token, { httpOnly: true })
        res.redirect('/u')
        // if NO user, create temp token and redirect to new-user page
      } else {
        let newProf = User.loginMapper('facebook', profile)
        let token = createToken(newProf, true)
        res.cookie(cookieName, token, { httpOnly: true, overwrite: true })
        res.redirect(`/c/new-user?token=${token}`)
      }
    } catch (err) {
      handleError(err, res, 1003)
    }
  }
)

module.exports = FacebookRouter
