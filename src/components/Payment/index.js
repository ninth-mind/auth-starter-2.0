import React from 'react'
import { Elements } from 'react-stripe-elements'
import InjectedCheckoutForm from './CheckoutForm'

function Checkout(props) {
  return (
    <Elements>
      <InjectedCheckoutForm {...props} />
    </Elements>
  )
}

export default Checkout
