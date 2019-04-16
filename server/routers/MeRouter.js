const express = require('express')
const MeRouter = express.Router()
const um = require('../database/userManagement')
const { verifyAuthenticationToken } = require('../lib/middleware')
const { respond, handleError } = require('../lib/utils')

MeRouter.get('/', verifyAuthenticationToken, (req, res) => {
  const { source } = req.locals.decodedToken
  um.findUser(source, req.locals.decodedToken, res)
    .then(user => {
      if (!user) respond(res, 403, 'Not authorized')
      else respond(res, 200, 'User Found', user)
    })
    .catch(err => handleError(err, res, 1001))
})

MeRouter.post('/', verifyAuthenticationToken, (req, res) => {
  const { toAdd } = req.body
  const { source } = req.locals.decodedToken
  um.findOneAndUpdate(
    source,
    req.locals.decodedToken,
    { $inc: { value: toAdd } },
    { new: true },
    res
  )
    .then(user => {
      if (!user) respond(res, 403, 'Not authorized')
      else {
        const { email, id, fname, lname, value } = user
        respond(res, 200, 'Value updated.', {
          email,
          id,
          fname,
          lname,
          value
        })
      }
    })
    .catch(err => handleError(err, res, 1001))
})

module.exports = MeRouter
