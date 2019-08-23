import React from 'react'
import ResetPasswordRequest from './ResetPasswordRequest'
import ResetPassword from './ResetPassword'
import SetEmail from './SetEmail'
import { Elements } from 'react-stripe-elements'
import InjectedCardDetailsForm from './CardDetails'

export function CardDetails(props) {
  return (
    <Elements>
      <InjectedCardDetailsForm {...props} />
    </Elements>
  )
}

export { ResetPasswordRequest, ResetPassword, SetEmail }
