import React from 'react'
import { useProfile } from '~/lib/hooks'
import { connect } from 'react-redux'
import { redirect } from '~/lib/utils'
import { actions } from '~/store'
import axios from 'axios'

function UserProfileAndAccount(props) {
  const { dispatch } = props

  // fetch the rest of the profile and dispatch profile to redux store
  const p = useProfile({}, true)
  if (Object.keys(p).length) {
    // dispatch user info to store
    dispatch({
      type: actions.CREDS,
      ...p
    })
    redirect('/u/profile')
  }

  return <p>fetching user profile</p>
}

// UserProfileAndAccount.getInitialProps = async ctx => {
//   try {
//     let r = await axios({
//       url: '/api/me',
//       method: 'get'
//     })
//     const profile = r.data.data
//     if (!profile) {
//       redirect('/c/login', ctx)
//     }
//     return profile
//   } catch (err) {
//     console.log('Error: fetching initial profile props', err)
//     return {}
//   }
// }

const mapStateToProps = (state, ownProps) => ({
  profile: ownProps.profile || state.profile
})

export default connect(mapStateToProps)(UserProfileAndAccount)
