import React from 'react'
import { withProfile } from '~/components/HOCs'
import CheckoutForm from '~/components/Payment'

function Checkout(props) {
  return (
    <div className="page">
      <CheckoutForm {...props} />
    </div>
  )
}

export default withProfile(Checkout)
