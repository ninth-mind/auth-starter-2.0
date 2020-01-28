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
  res.send('it worked - post')
})

ProductRouter.put('/', (req, res) => {
  console.log(req.body)
  res.send('it worked  - put')
})

ProductRouter.delete('/:id', (req, res) => {
  console.log(req.params)
  res.send('it worked  - delete')
})

module.exports = ProductRouter
