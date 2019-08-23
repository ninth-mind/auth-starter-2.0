import React from 'react'
import { Elements } from 'react-stripe-elements'
import InjectedCheckoutForm from './CheckoutForm'

export function CheckoutForm(props) {
  return (
    <Elements>
      <InjectedCheckoutForm {...props} />
    </Elements>
  )
}
