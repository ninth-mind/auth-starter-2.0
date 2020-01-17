const express = require('express')
const PaymentRouter = express.Router()
const config = require('../config')
const User = require('../services/user')

const { respond, handleError } = require('../lib/utils')
const {
  verifyAuthenticationToken,
  verifyCaptcha
} = require('../lib/middleware')
const stripe = require('stripe')(config.stripe.secretKey)

PaymentRouter.post('/payment', verifyAuthenticationToken, (req, res) => {
  const { profile } = req.locals.userInfo
  // TODO: FINISH THE ABILITY TO ADD PAYMENTS
  respond(res, 400, 'there is no resource here yet')
})

// Charge card
PaymentRouter.post(
  '/charge',
  // verifyAuthenticationToken,
  verifyCaptcha,
  async (req, res) => {
    const { amount, stripeToken } = req.body
    const { profile } = req.locals.userInfo
    console.log('TOKEN', stripeToken)
    try {
      // create charge
      const charge = await stripe.charges.create({
        amount: amount,
        currency: 'usd',
        description: 'Leaderboard',
        source: stripeToken.id
      })
      console.log('CHARGE', charge)

      // TODO: add charge to user history
      respond(res, 200, 'Card Charged', charge)
    } catch (err) {
      handleError(err)
      respond(res, 400, 'Error charging card', err)
    }
  }
)

// Charge and Save
PaymentRouter.post(
  '/charge-save',
  verifyAuthenticationToken,
  verifyCaptcha,
  async (req, res) => {
    const { amount, stripeToken } = req.body
    const {
      userInfo,
      userInfo: { email, source }
    } = req.locals

    console.log('TOKEN', stripeToken)
    try {
      // create customer
      const customer = await stripe.customers.create({
        source: stripeToken.id,
        email: email
      })

      // create charge
      const charge = await stripe.charges.create({
        amount: amount,
        currency: 'usd',
        description: 'Leaderboard',
        customer: customer.id
      })

      let u = await User.findOneAndUpdate(
        source,
        userInfo,
        { customer: { id: customer.id }, $push: { charges: charge } },
        { new: true }
      )

      // TODO: add charge to user history
      respond(res, 200, 'Card Charged, Customer Created', { charge, customer })
    } catch (err) {
      handleError(err)
      respond(res, 400, 'Error charging card', err)
    }
  }
)

PaymentRouter.post(
  '/intent',
  // verifyAuthenticationToken,
  // verifyCaptcha,
  async (req, res) => {
    const {
      userInfo,
      userInfo: { email, source }
    } = req.locals
    const {
      amount,
      currency,
      payment_method_types,
      // stripeToken,
      paymentIntentSecret
    } = req.body

    try {
      let intent
      if (paymentIntentSecret) {
        intent = await stripe.paymentIntents.update({
          amount,
          currency: currency || 'usd',
          payment_method_types: payment_method_types || ['card']
        })
      } else {
        intent = await stripe.paymentIntents.create({
          amount: amount,
          currency: 'usd',
          payment_method_types: ['card']
        })
      }
      respond(res, 200, 'Payment intent created', intent)
    } catch (err) {
      handleError(err)
    }
  }
)

module.exports = PaymentRouter
