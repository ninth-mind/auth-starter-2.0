const express = require('express')
const LeadersRouter = express.Router()
const UserModel = require('../services/user/UserModel')
const { respond, handleError } = require('../lib/utils')

LeadersRouter.get('/', (req, res) => {
  UserModel.find({})
    .sort({ value: -1 })
    .then(result => {
      respond(res, 200, 'Leaders Found', result)
    })
    .catch(err => handleError(err, res, 1000))
})

module.exports = LeadersRouter
