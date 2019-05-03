require('dotenv').config()
const jwt = require('jsonwebtoken')
const axios = require('axios')
const passport = require('passport')
const db = require('../services/database')
const { RateLimiterMongo } = require('rate-limiter-flexible')
const { handleError, respond } = require('./utils')
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
    respond(res, 403, 'You are not authorized')
  else next()
}

// middleware to protect routes from unAuthorized tokens
function verifyAuthenticationToken(req, res, next) {
  try {
    // check if the token is in the cookies or the req.params
    let token
    if (req.params.token) {
      token = req.params.token
    } else if (req.cookies && req.cookies[cookieName]) {
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
          return respond(res, 403, 'Your session has expired')
        } else return handleError(err, res, 4000)
      }
      req.locals = { decodedToken: decoded, token }
      next()
    })
  } catch (err) {
    return respond(res, 400, 'No token present')
  }
}

/**
 * Creates a middleware function with the specific permissions to check for
 * User must have all permissions to continue
 * @param {Array} permissions - Array of permission strings
 */
function makePermissionsMiddleware(permissions) {
  return function(req, res, next) {
    const userPermissions = req.locals.decodedToken.permissions
    let isAllowed = permissions.reduce((allowed, p) => {
      return userPermissions.includes(p) && allowed
    }, true)
    if (isAllowed) next()
    else respond(res, 403, 'You are not authorized')
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
          console.log('RECAPTCHA VALUE: ', data)
          respond(res, 403, 'Invalid reCaptcha', { reCaptcha: data })
        }
      })
      .catch(err => handleError(err, res, 4001))
  } catch (err) {
    respond(res, 403, 'Invalid captcha. No captcha info present.')
  }
}

//  ___    _ _____ ___   _    ___ __  __ ___ _____ ___ ___
// | _ \  /_\_   _| __| | |  |_ _|  \/  |_ _|_   _| __| _ \
// |   / / _ \| | | _|  | |__ | || |\/| || |  | | | _||   /
// |_|_\/_/ \_\_| |___| |____|___|_|  |_|___| |_| |___|_|_\
//
const rateLimiter = new RateLimiterMongo({
  storeClient: db,
  points: 100, // Number of points
  duration: 1 // Per second(s)
})

function rateLimiterMiddleware(req, res, next) {
  rateLimiter
    .consume(req.ip, 1)
    .then(() => {
      next()
    })
    .catch(() => {
      respond(res, 429, 'Too many requests')
    })
}

module.exports = {
  verifyOrigin,
  verifyCaptcha,
  verifyAuthenticationToken,
  makePermissionsMiddleware,
  passport,
  rateLimiterMiddleware
}
