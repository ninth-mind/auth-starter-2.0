import React from 'react'
import { connect } from 'react-redux'
import { signOut } from '~/lib/utils'
import { withProfile } from '~/components/HOCs'
import AddValue from '~/components/AddValue'

class Account extends React.Component {
  constructor(props) {
    super(props)
    this.signOut = this.signOut.bind(this)
  }

  signOut() {
    const { dispatch } = this.props
    signOut(dispatch)
  }

  render() {
    const p = this.props.profile
    return (
      <div className="page">
        <h1>Account</h1>
        <h2>Welcome {p.username},</h2>
        <h4>Email: {p.email}</h4>
        <h4>Value: {p.value}</h4>
        <p>Nothing here yet....</p>
        <AddValue />
        <button onClick={this.signOut}>Sign Out</button>
      </div>
    )
  }
}

export default withProfile(Account)
