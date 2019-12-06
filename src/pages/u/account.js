import React from 'react'
import axios from 'axios'
import { redirect } from '~/lib/utils'
import { withProfile } from '~/components/HOCs'
import { Button, Divider, notification, Popconfirm } from 'antd'
import AddValue from '~/components/AddValue'
import { SetEmail, CardDetails } from '~/components/AccountManagement'
import { useProfile } from '~/lib/hooks'
import { actions } from '~/store'
import { connect } from 'react-redux'

function Account(props) {
  const { dispatch } = props
  let p = useProfile({}, true)

  // if (Object.keys(p).length) {
  //   // dispatch user info to store
  //   dispatch({
  //     type: actions.CREDS,
  //     ...p
  //   })
  // }

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

const mapStateToProps = state => ({
  profile: state.profile
})

export default connect(mapStateToProps)(Account)
