const express = require('express')
const ApiRouter = express.Router()
const AuthRouter = require('./AuthRouter')
const PaymentRouter = require('./PaymentRouter')
const MeRouter = require('./MeRouter')
const LeadersRouter = require('./LeadersRouter')
const ProductRouter = require('./ProductRouter')
const mongoDB = require('../connections/mongoDB')

ApiRouter.get('/', (req, res) => {
  res.send(`Congrats!, You've reached the API`)
})

ApiRouter.use('/auth', AuthRouter)
ApiRouter.use('/me', MeRouter)
ApiRouter.use('/leaders', LeadersRouter)
ApiRouter.use('/payment', PaymentRouter)
ApiRouter.use('/product', ProductRouter)

module.exports = ApiRouter
