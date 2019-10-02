const express = require('express')
const ProductRouter = express.Router()
const config = require('../config')
// const stripe = require('stripe')(config.stripe.secretKey)

// const {
//   verifyCaptcha,
//   verifyAuthenticationToken,
//   // makePermissionsMiddleware
// } = require('../lib/middleware')
// const { handleError, respond, createToken, setCookie } = require('../lib/utils')

/**
 * Creates Product in Strapi
 */
ProductRouter.post('/', (req, res) => {
  console.log(req.body)
  res.send('it worked')
})

ProductRouter.put('/', (req, res) => {
  console.log(req.body)
  res.send('it worked')
})

ProductRouter.delete('/', (req, res) => {
  console.log(req.body)
  res.send('it worked')
})

module.exports = ProductRouter
