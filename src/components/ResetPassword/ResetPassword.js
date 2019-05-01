import React from 'react'
import { connect } from 'react-redux'
import { handleFormInput } from '~/lib/utils'

function PasswordResetRequest(props) {
  let password = handleFormInput('')
  let confirmation = handleFormInput('')
  let handleSubmit = props.handleSubmit.bind(this)

  return (
    <div className="password page">
      <h1>Password Reset</h1>
      <p>Input your new password below</p>
      <form
        className="form"
        onSubmit={e => handleSubmit(e, password.value, confirmation.value)}
      >
        <div className="form__input-group">
          <label htmlFor="password">New Password:</label>
          <input id="password" type="password" {...password} />
        </div>
        <div className="form__input-group">
          <label htmlFor="confrimation">Confirm New Password:</label>
          <input id="confrimation" type="password" {...confirmation} />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default connect()(PasswordResetRequest)
