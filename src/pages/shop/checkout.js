import React from 'react'
import axios from 'axios'
import { withProfile } from '~/components/HOCs'
import { CardDetails } from '~/components/AccountManagement'

function Checkout(props) {
  return (
    <div className="page">
      <p>You're buying something here from the shop! COOL!</p>
      <CardDetails {...props} handleCard={handleCardDetails} submitText="Pay" />
    </div>
  )
}

async function handleCardDetails(stripeToken, recaptcha, data) {
  let result = await axios({
    method: 'post',
    url: `/api/payment/charge`,
    data: { recaptcha, stripeToken, amount: 999 }
  })

  console.log(result)
  return {
    message: 'Card Charged',
    description: 'You card has been charged'
  }
}

export default withProfile(Checkout)
