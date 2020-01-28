import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { actions } from '~/store'
import { Button, Divider, Popconfirm } from 'antd'
import { Cart } from '~/components/Cart'
import { handleError } from '~/lib/utils'
import { CardDetails, AddressDetails } from '~/components/AccountManagement'
import './checkout.scss'

function Checkout(props) {
  const { dispatch, cart, profile } = props

  // if (!cart.paymentIntentId) {
  //   fetchIntent()
  //     .then(r => {
  //       dispatch({
  //         type: actions.SET_PAYMENT_INTENT_ID,
  //         paymentIntentId: r.data.data.id
  //       })
  //     })
  //     .catch(err => handleError(err))
  // }

  /**
   * Fetches intent id from server.
   *
   */
  async function fetchIntent() {
    // call server, to update or create payment intent
    try {
      // grab existing payment intent if one exists
      let r = await axios({
        method: 'post',
        url: `/api/payment/intent`,
        data: {
          amount: cart.total * 100,
          payment_method_types: ['card'],
          currency: 'usd'
        }
      })

      // store payment intent with localstorage
      let paymentIntentId = r.data.data.id
      return paymentIntentId
    } catch (err) {
      handleError(err)
    }
  }

  /**
   * Handle submit
   * This function is passed down to the CardDetails component, telling it what it should do when a card is submitted.
   *
   * @param {string} stripeToken - the stripe token that will be generated using the stripe api when the
   *                                card information is submitted
   * @param {string} recaptchaToken - the recaptcha token generated when calling google recaptcha
   * @param {object} data - the actual values that are passed into the form. ( likely only will recieve name )
   */
  async function handleCardDetails(stripeToken, recaptchaToken, data) {
    console.log('data from card, ', data)
    let result = await axios({
      method: 'post',
      url: `/api/payment/charge-save`,
      data: { recaptcha: recaptchaToken, stripeToken, amount: 999 }
    })

    return {
      message: 'Card Charged',
      description: 'You card has been charged'
    }
  }

  /**
   * clears cart
   */
  function clear() {
    dispatch({ type: actions.CLEAR_CART })
  }

  return (
    <div className="page checkout">
      <section className="side">
        <h2>What is in your cart:</h2>
        <Cart />
        <Popconfirm title="Are you sure you want to clear?" onConfirm={clear}>
          <Button type="secondary" disabled={cart.products.length <= 0}>
            Clear Cart
          </Button>
        </Popconfirm>
      </section>
      <section className="side">
        <h1>Payment Details</h1>
        <CardDetails handleSubmit={handleCardDetails} submitText="Pay" />
        <Divider />
        <AddressDetails callback={c => console.log(c)} />
      </section>
    </div>
  )
}

const mapStateToProps = state => ({
  cart: state.cart,
  profile: state.profile
})

export default connect(mapStateToProps)(Checkout)
