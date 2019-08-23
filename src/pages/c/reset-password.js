import React from 'react'
import { connect } from 'react-redux'
import {
  ResetPassword,
  ResetPasswordRequest
} from '~/components/AccountManagement'

function ResetPasswordPage(props) {
  return (
    <div className="password page">
      {props.token ? (
        <ResetPassword {...props} />
      ) : (
        <ResetPasswordRequest {...props} />
      )}
    </div>
  )
}

ResetPasswordPage.getInitialProps = async ({ query }) => ({
  token: query.token
})

export default connect()(ResetPasswordPage)
