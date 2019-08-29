const express = require('express')
const ApiRouter = express.Router()
const AuthRouter = require('./AuthRouter')
const PaymentRouter = require('./PaymentRouter')
const MeRouter = require('./MeRouter')
const MailRouter = require('./MailRouter')
const LeadersRouter = require('./LeadersRouter')
const db = require('../services/database')

ApiRouter.get('/', (req, res) => {
  res.send(`Congrats!, You've reached the API`)
})

ApiRouter.use('/auth', AuthRouter)
ApiRouter.use('/me', MeRouter)
ApiRouter.use('/mail', MailRouter)
ApiRouter.use('/leaders', LeadersRouter)
ApiRouter.use('/payment', PaymentRouter)

module.exports = ApiRouter
