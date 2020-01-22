import React from 'react'
import { connect } from 'react-redux'
import { useRouter } from 'next/router'
import {
  ResetPassword,
  ResetPasswordRequest
} from '~/components/AccountManagement'

function ResetPasswordPage(props) {
  let { query } = useRouter()
  return (
    <div className="password page">
      {query.token ? (
        <ResetPassword {...props} />
      ) : (
        <ResetPasswordRequest {...props} />
      )}
    </div>
  )
}

export default connect()(ResetPasswordPage)
