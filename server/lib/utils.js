const jwt = require('jsonwebtoken')
const ErrorCodes = require('./errorCodes')
const {
  secret,
  tempTokenExpiryTime,
  tokenExpiryTime,
  cookieName,
  cookieExpiration
} = require('../config').utils

/**
 * Creates token.
 * - If the token is meant to be temporary, then pass the entire profile through
 * to be received on the other end.
 * - If the token is meant to be permanent, strip the token down to essentials.
 * @param {Object} payload - make cookie
 */
function createToken(p, isTemp = false) {
  let payload = p
  // strips down token if is NOT temp
  if (!isTemp)
    payload = {
      source: p.source,
      id: p._id,
      email: p.email,
      username: p.username,
      permissions: p.permissions
    }
  return jwt.sign(payload, secret, {
    expiresIn: isTemp ? tempTokenExpiryTime : tokenExpiryTime
  })
}

/**
 * Sets cookie ok the response header sent back to the frontend
 * @param {object} res - response object
 * @param {string} token - token to set in the cookie
 * @param {boolean} overwrite - whether or not to overwrite the existing cookie
 */
function setCookie(res, token, overwrite) {
  res.cookie(cookieName, token, {
    httpOnly: true,
    sameSite: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + cookieExpiration),
    overwrite: !!overwrite
  })
}
/**
  Error handling. Only to be used when the SERVER is experiencing an error. Not
  to be used when sending back incorrect credential errors and so forth.

  @param {object} err : The error object generated.
  @param {object} res : The response object to send back to the user.
  @param {string} msg : A message that will help identify the origin of the error.
*/
function handleError(err, res, code) {
  if (code) console.log(ErrorCodes[code])
  if (err) console.log(err)
  if (res) {
    return respond(res, 500, ErrorCodes[code], { code, err })
  }
}

/**
 * Sends response to client
 * @param {Object} res - express response object
 * @param {Int} status - response status
 * @param {string} message - message to respond with
 * @param {object} data - data to respond with
 */
function respond(res, status = 200, message = 'ok', data) {
  res.status(status).send({
    msg: message,
    data: data
  })
}

module.exports = {
  respond,
  createToken,
  handleError,
  setCookie
}
