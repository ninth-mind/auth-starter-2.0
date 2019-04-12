const express = require('express')
const ApiRouter = express.Router()
const AuthRouter = require('./AuthRouter')
const db = require('../connections/database')

ApiRouter.get('/', (req, res) => {
  res.send(`Congrats!, You've reached the API`)
})

ApiRouter.use('/auth', AuthRouter)
ApiRouter.use('/me', AuthRouter)

module.exports = ApiRouter
