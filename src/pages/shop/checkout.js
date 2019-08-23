import React from 'react'
import { withProfile } from '~/components/HOCs'
import { CardDetails } from '~/components/AccountManagement'

function Checkout(props) {
  return (
    <div className="page">
      <CardDetails {...props} />
    </div>
  )
}

export default withProfile(Checkout)
