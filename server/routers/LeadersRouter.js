const express = require('express')
const LeadersRouter = express.Router()
const User = require('../services/user')
const { respond, handleError } = require('../lib/utils')

LeadersRouter.get('/', (req, res) => {
  User.getUsers()
    .then(result => {
      respond(res, 200, 'Leaders Found', result)
    })
    .catch(err => handleError(err, res, 1000))
})

module.exports = LeadersRouter
