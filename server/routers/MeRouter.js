const express = require('express')
const MeRouter = express.Router()
const User = require('../services/user')
const { verifyAuthenticationToken } = require('../lib/middleware')
const { respond, handleError } = require('../lib/utils')

MeRouter.get('/', verifyAuthenticationToken, (req, res) => {
  const { source } = req.locals.decodedToken
  User.findUser(source, req.locals.decodedToken)
    .then(user => {
      if (!user) respond(res, 403, 'Not authorized')
      else respond(res, 200, 'User Found', user)
    })
    .catch(err => handleError(err, res, 1001))
})

MeRouter.post('/', verifyAuthenticationToken, (req, res) => {
  const { toAdd } = req.body
  const { source } = req.locals.decodedToken
  User.findOneAndUpdate(
    source,
    req.locals.decodedToken,
    { $inc: { value: toAdd } },
    { new: true }
  )
    .then(user => {
      if (!user) respond(res, 403, 'Not authorized')
      else {
        const { value } = user
        respond(res, 200, 'Value updated.', { value })
      }
    })
    .catch(err => handleError(err, res, 1001))
})

module.exports = MeRouter
