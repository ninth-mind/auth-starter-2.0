import React from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { signOut, redirect } from '~/lib/utils'
import { withProfile } from '~/components/HOCs'

class Account extends React.Component {
  constructor(props) {
    super(props)
    this.signOut = this.signOut.bind(this)
  }

  signOut() {
    const { dispatch } = this.props
    signOut(dispatch)
  }

  async deleteAccount() {
    let r = await axios({
      method: 'delete',
      url: '/api/me'
    })
    console.log('DELETE USER RESPONSE', r)
    redirect('/')
    toast.success('Your account has been deleted')
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

        <button onClick={this.signOut}>Sign Out</button>
        <button onClick={this.deleteAccount}>Delete Account</button>
      </div>
    )
  }
}

export default withProfile(Account)
