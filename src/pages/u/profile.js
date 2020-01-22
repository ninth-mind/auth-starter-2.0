import React from 'react'
import { connect } from 'react-redux'
import AddValue from '~/components/AddValue'
import { Skeleton } from 'antd'

function Profile(props) {
  const { profile } = props
  let content = <Skeleton avatar active paragraph={{ rows: 2 }} />

  // check if the profile is empty
  if (Object.keys(profile).length) {
    // set content to Profile page
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

const mapStateToProps = state => ({
  profile: state.profile
})

export default connect(mapStateToProps)(Profile)
