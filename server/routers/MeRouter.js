const express = require('express')
const MeRouter = express.Router()
const UserModel = require('../models/UserModel')
const { verifyAuthenticationToken } = require('../lib/middleware')
const { respond, handleError } = require('../lib/utils')

MeRouter.get('/', verifyAuthenticationToken, (req, res) => {
  const { email } = req.locals.decodedToken
  UserModel.findOne({ email })
    .then(user => {
      if (!user) respond(res, 401, 'Not authorized')
      else {
        const { email, id, fname, lname, value } = user
        respond(res, 200, 'User Found', {
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

MeRouter.post('/', verifyAuthenticationToken, (req, res) => {
  const { toAdd } = req.body
  const { email } = req.locals.decodedToken
  UserModel.findOneAndUpdate(
    { email },
    { $inc: { value: toAdd } },
    { new: true }
  )
    .then(user => {
      if (!user) respond(res, 401, 'Not authorized')
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
