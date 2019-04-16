const express = require('express')
const ApiRouter = express.Router()
const AuthRouter = require('./AuthRouter')
const MeRouter = require('./MeRouter')
const LeadersRouter = require('./LeadersRouter')
const db = require('../database')

ApiRouter.get('/', (req, res) => {
  res.send(`Congrats!, You've reached the API`)
})

ApiRouter.use('/auth', AuthRouter)
ApiRouter.use('/me', MeRouter)
ApiRouter.use('/leaders', LeadersRouter)

module.exports = ApiRouter
