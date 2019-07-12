import React from 'react'
import { withProfile } from '~/components/HOCs'
import Checkout from '~/components/Payment'
function Buy(props) {
  return (
    <div className="page">
      <Checkout {...props} />
    </div>
  )
}

export default withProfile(Buy)
