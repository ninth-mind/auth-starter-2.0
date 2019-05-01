import React from 'react'
import { connect } from 'react-redux'
import { handleFormInput } from '~/lib/utils'

function PasswordResetRequest(props) {
  let email = handleFormInput('')
  let handleSubmit = props.handleSubmit.bind(this)
  return (
    <div className="password page">
      <h1>Password Reset</h1>
      <p>
        Input your email below and we will send you an email with password reset
        information
      </p>
      <form className="form" onSubmit={e => handleSubmit(e, email.value)}>
        <div className="form__input-group">
          <label htmlFor="email">Email:</label>
          <input id="email" type="email" {...email} />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default connect()(PasswordResetRequest)
