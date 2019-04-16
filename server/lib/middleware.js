require('dotenv').config()
const jwt = require('jsonwebtoken')
const axios = require('axios')
const passport = require('passport')
const { handleError } = require('./utils')
const secret = process.env.SECRET
const clientURL = process.env.CLIENT_URL
const cookieName = process.env.COOKIE_NAME
const captchaSecretKey = process.env.CAPTCHA_SECRET_KEY
const captchaThreshold = process.env.CAPTCHA_THRESHOLD

passport.serializeUser(function(user, done) {
  done(null, user)
})

passport.deserializeUser(function(user, done) {
  done(null, user)
})

function verifyOrigin(req, res, next) {
  if (process.env.NODE_ENV !== 'production') next()
  else if (req.headers.origin !== clientURL)
    res.status(403).send({ msg: 'You are not autorized' })
  else next()
}

// middleware to protect routes from unAuthorized tokens
function verifyAuthenticationToken(req, res, next) {
  try {
    // check if the token is in the cookies or the authorization header
    let token
    if (req.cookies && req.cookies[cookieName]) {
      token = req.cookies[cookieName]
    }

    // verify token
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        if (
          err.name === 'TokenExpiredError' ||
          err.message === 'jwt malformed' ||
          err.message === 'jwt must be provided'
        ) {
          return res.status(403).send('Your session has expired.')
        } else return handleError(err, res, 4000)
      }
      req.locals = { decodedToken: decoded }
      next()
    })
  } catch (err) {
    return res.status(400).send('No token present')
  }
}

function verifyCaptcha(req, res, next) {
  const { recaptcha } = req.body
  try {
    axios({
      method: 'post',
      url: `https://www.google.com/recaptcha/api/siteverify`,
      params: {
        secret: captchaSecretKey,
        response: recaptcha,
        remoteip: req.connection.remoteAddress
      }
    })
      .then(({ status, data }) => {
        if (status === 200 && data.score >= captchaThreshold && data.success)
          next()
        else {
          res.status(403).send({ msg: 'Invalid reCaptcha', reCaptcha: data })
          console.log('RECAPTCHA VALUE: ', data)
        }
      })
      .catch(err => handleError(err, res, 4001))
  } catch (err) {
    res.status(403).send('Invalid captcha. No captcha info present.')
  }
}

module.exports = {
  verifyOrigin,
  verifyCaptcha,
  verifyAuthenticationToken,
  passport
}
