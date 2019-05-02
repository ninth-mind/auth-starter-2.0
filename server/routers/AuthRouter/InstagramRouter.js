const express = require('express')
const { passport } = require('../../lib/middleware')
const InstagramRouter = express.Router()
const InstagramStrategy = require('passport-instagram')
const User = require('../../services/user')
const { handleError, createToken, setCookie } = require('../../lib/utils')
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
    failureRedirect: `${clientURL}/c`,
    session: false,
    showDialog: true
  })
)

InstagramRouter.get(
  '/callback',
  passport.authenticate('instagram', {
    failureRedirect: '/c'
  }),
  async (req, res) => {
    try {
      const { profile } = req.user
      let user = await User.findUser('instagram', profile)
      // if user is found, log them in and redirect to profile
      if (user) {
        let token = createToken(user.toObject())
        setCookie(res, token)
        res.redirect('/u')
        // if NO user, create temp token and redirect to new-user page
      } else {
        let newProf = User.loginMapper('instagram', profile)
        let token = createToken(newProf, true)
        setCookie(res, token, true)
        res.redirect(`/c/new-user?token=${token}`)
      }
    } catch (err) {
      handleError(err, res, 1003)
    }
  }
)

module.exports = InstagramRouter
