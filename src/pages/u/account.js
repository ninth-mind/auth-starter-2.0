import React from 'react'
import axios from 'axios'
import { redirect, signOut } from '~/lib/utils'
import { Button, Divider, notification, Popconfirm } from 'antd'
import AddValue from '~/components/AddValue'
import { SetEmail, CardDetails } from '~/components/AccountManagement'
import { connect } from 'react-redux'

function Account(props) {
  const { dispatch, profile } = props

  function logout() {
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

  return (
    <div className="page">
      <h1>Account</h1>
      <h2>Welcome {profile.username},</h2>
      <h4>Email: {profile.email}</h4>
      <h4>Value: {profile.value}</h4>
      <AddValue />
      <SetEmail />
      <Divider>Billing Details</Divider>
      <CardDetails submitText="Add Card" handleCard={handleCardDetails} />
      <Divider>Delete Account</Divider>
      <Button type="primary" onClick={logout}>
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

const mapStateToProps = state => ({
  profile: state.profile
})

export default connect(mapStateToProps)(Account)
