import React from 'react'
import axios from 'axios'
import { Cart } from '~/components/Cart'
import { withProfile } from '~/components/HOCs'
import { CardDetails, AddressDetails } from '~/components/AccountManagement'

function Checkout(props) {
  async function handleCardDetails(stripeToken, recaptchaToken, data) {
    let result = await axios({
      method: 'post',
      url: `/api/payment/charge`,
      data: { recaptcha: recaptchaToken, stripeToken, amount: 999 }
    })

    return {
      message: 'Card Charged',
      description: 'You card has been charged'
    }
  }

  return (
    <div className="page">
      <h2>What is in your cart:</h2>
      <Cart />
      <CardDetails handleSubmit={handleCardDetails} submitText="Pay" />
      <AddressDetails callback={c => console.log(c)} />
    </div>
  )
}

export default withProfile(Checkout, false)
