import React from 'react'
import axios from 'axios'
import { signOut, redirect } from '~/lib/utils'
import { withProfile } from '~/components/HOCs'
import { Button, Divider, notification, Popconfirm } from 'antd'
import AddValue from '~/components/AddValue'
import { SetEmail, CardDetails } from '~/components/AccountManagement'

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
        <SetEmail recaptcha={this.props.recaptcha} />
        <Divider>Billing Details</Divider>
        <CardDetails
          {...this.props}
          submitText="Add Card"
          handleCard={handleCardDetails}
        />
        <Divider>Delete Account</Divider>
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

async function handleCardDetails(stripeToken, recaptcha, data) {
  let result = await axios({
    method: 'post',
    url: `/api/me/card`,
    data: { recaptcha, stripeToken }
  })

  console.log(result)
  return {
    message: 'Card Added',
    description: 'You card has been added to your account'
  }
}

export default withProfile(Account)
