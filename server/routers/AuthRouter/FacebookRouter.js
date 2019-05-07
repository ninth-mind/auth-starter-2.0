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
  new FacebookStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: `${serverURL}/api/auth/facebook/callback`,
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
  '/',
  passport.authenticate('facebook', {
    failureRedirect: `${clientURL}/c`,
    session: false,
    showDialog: true,
    scope: ['public_profile', 'email']
  })
)

FacebookRouter.get(
  '/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/c',
    scope: ['public_profile', 'email']
  }),
  async (req, res) => {
    try {
      const { profile } = req.user
      console.log('PROFILE', profile)
      let user = await User.findUser('facebook', profile)
      // if user is found, log them in and redirect to profile
      if (user) {
        let token = createToken(user.toObject())
        setCookie(res, token)
        res.redirect('/u')
        // if NO user, create temp token and redirect to new-user page
      } else {
        let newProf = User.loginMapper('facebook', profile)
        let token = createToken(newProf, true)
        setCookie(res, token, true)
        res.redirect(`/c/new-user?token=${token}`)
      }
    } catch (err) {
      handleError(err, res, 1003)
    }
  }
)

module.exports = FacebookRouter
