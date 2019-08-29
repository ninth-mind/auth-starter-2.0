import React from 'react'
import axios from 'axios'
import { signOut, redirect, handleError } from '~/lib/utils'
import { withProfile } from '~/components/HOCs'
import { Button, Divider, notification, Popconfirm } from 'antd'
import AddValue from '~/components/AddValue'
import { SetEmail, CardDetails } from '~/components/AccountManagement'

function Account(props) {
  const { dispatch } = props

  function signOut() {
    signOut(dispatch)
  }

  async function handleCardDetails(stripeToken, recaptcha) {
    try {
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
    } catch (err) {
      console.log(err)
      notification.error({ message: 'Error adding card' })
    }
  }

  async function deleteAccount() {
    try {
      let r = await axios({
        method: 'delete',
        url: '/api/me'
      })
      console.log('DELETE USER RESPONSE', r)
      redirect('/')
      notification.success({ message: 'Your account has been deleted' })
    } catch (err) {
      console.log(err)
      notification.error({ message: 'Error deleting account' })
    }
  }

  const p = props.profile
  return (
    <div className="page">
      <h1>Account</h1>
      <h2>Welcome {p.username},</h2>
      <h4>Email: {p.email}</h4>
      <h4>Value: {p.value}</h4>
      <p>Nothing here yet....</p>
      <AddValue />
      <SetEmail />
      <Divider>Billing Details</Divider>
      <CardDetails submitText="Add Card" handleCard={handleCardDetails} />
      <Divider>Delete Account</Divider>
      <Button type="primary" onClick={signOut}>
        Sign Out
      </Button>
      <Popconfirm
        title="Are you sure delete your account?"
        onConfirm={deleteAccount}
      >
        <Button type="danger">Delete Account</Button>
      </Popconfirm>
    </div>
  )
}

export default withProfile(Account)
