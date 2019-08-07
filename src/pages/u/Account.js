import React from 'react'
import axios from 'axios'
import { signOut, redirect } from '~/lib/utils'
import { withProfile } from '~/components/HOCs'
import { notification, Button, Popconfirm } from 'antd'
import AddValue from '~/components/AddValue'
import AddCard from '~/components/Payment/AddCard'
import { SetEmail } from '~/components/Resets'

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
    notification.success({ message: 'Your account has been deleted' })
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
        <hr />
        <SetEmail recaptcha={this.props.recaptcha} />
        <hr />
        <AddCard />
        <hr />
        <Button type="primary" onClick={this.signOut}>
          Sign Out
        </Button>
        <Popconfirm
          title="Are you sure delete your account?"
          onConfirm={this.deleteAccount}
        >
          <Button type="danger">Delete Account</Button>
        </Popconfirm>
      </div>
    )
  }
}

export default withProfile(Account)
