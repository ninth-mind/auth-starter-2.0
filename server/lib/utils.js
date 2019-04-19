const jwt = require('jsonwebtoken')
const ErrorCodes = require('./errorCodes')
const { determinePayloadFromSource } = require('../services/user')
const secret = process.env.SECRET
const tokenExpiryTime = process.env.TOKEN_EXPIRATION_TIME
const cookieName = process.env.COOKIE_NAME
/**
 *  Signs and sends token back to user
 *
 * @param {object} user - The user to use to get token information from
 * @param {object} res - The express response object
 * @param {boolean} blockRedirect - boolean to block redirect and respond directly to call
 */
function respondWithToken(user, res, redirect) {
  const payload = determinePayloadFromSource(user.source, user)
  const token = jwt.sign(payload, secret, {
    expiresIn: tokenExpiryTime
  })
  res.cookie(cookieName, token, { httpOnly: true })
  if (redirect) {
    let redirectURL =
      user.wasNew || payload.permissions.length === 0
        ? `/c/new-user?token=${token}`
        : '/u'
    res.redirect(redirectURL)
  } else respond(res, 200, 'login successful', { token, wasNew: user.wasNew })
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
    return res
      .status(500)
      .send({ error: err, message: ErrorCodes[code], code: code })
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
  respondWithToken,
  handleError
}
