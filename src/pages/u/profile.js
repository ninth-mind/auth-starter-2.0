import React from 'react'
import { connect } from 'react-redux'
import AddValue from '~/components/AddValue'
import { Skeleton } from 'antd'
import { actions } from '~/store'
import axios from 'axios'

class Profile extends React.Component {
  static async getInitialProps(ctx) {
    if (ctx.req) return {}
    // profile fetching happens at root level app on server side render
    else {
      try {
        const { dispatch } = ctx.reduxStore
        let r = await axios({
          method: 'get',
          url: '/api/me' // cookie should already be attached
        })
        const prof = { ...r.data.data.user }
        dispatch({
          type: actions.PROFILE,
          ...prof
        })
        return { profile: prof }
      } catch (err) {
        console.log('ERROR FETCHING PROFILE', err)
        return {}
      }
    }
  }

  shouldComponentUpdate(nextProps) {
    const curProfile = this.props.profile
    const nextProfile = nextProps.profile

    for (let [key, value] of Object.entries(curProfile)) {
      if (nextProfile[key] !== value) return true
    }
    return false
  }

  render() {
    const { profile } = this.props
    let content = <Skeleton avatar active paragraph={{ rows: 2 }} />
    if (profile.username) {
      content = (
        <>
          <h2>Welcome {profile.username},</h2>
          <h3>Current Value: {profile.value}</h3>
          <AddValue />
        </>
      )
    }

    return (
      <div className="profile page">
        <h1>Profile</h1>
        {content}
      </div>
    )
  }
}
// function Profile(props) {
//   const { profile, dispatch } = props

//   console.log('rendering', profile, p)
//   let content = <Skeleton avatar active paragraph={{ rows: 2 }} />

//   // check if the profile is empty
//   if (Object.keys(profile).length) {
//     // set content to Profile page
//     content = (
//       <>
//         <h2>Welcome {p.username},</h2>
//         <h3>Current Value: {p.value}</h3>
//         <AddValue />
//       </>
//     )
//   }

//   return (
//     <div className="profile page">
//       <h1>Profile</h1>
//       {content}
//     </div>
//   )
// }

// /**
//  * FETCHES THE REMAINING PROFILE INFORMATION
//  * This is neccessary because when you reroute from login, the cookie only contains
//  */
// Profile.getInitialProps = async ctx => {
//   if (ctx.req) return {}
//   // profile fetching happens at root level app on server side render
//   else {
//     const { dispatch } = ctx.reduxStore
//     try {
//       let r = await axios({
//         method: 'get',
//         url: '/api/me' // cookie should already be attached
//       })
//       const prof = { ...r.data.data.user }
//       return { profile: prof }
//     } catch (err) {
//       console.log('ERROR FETCHING PROFILE', err)
//       return {}
//     }
//   }
// }

const mapStateToProps = state => ({
  profile: { ...state.profile }
})

export default connect(mapStateToProps)(Profile)
