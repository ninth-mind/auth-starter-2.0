import React from 'react'
import { connect } from 'react-redux'
import { withProfile } from '~/components/HOCs'
import AddValue from '~/components/AddValue'
import { Skeleton } from 'antd'

function Profile(props) {
  const p = props.profile
  let content = <Skeleton avatar active paragraph={{ rows: 2 }} />

  // check if the profile is empty
  if (Object.keys(p).length) {
    // set content to Profile page
    content = (
      <>
        <h2>Welcome {p.username},</h2>
        <h3>Current Value: {p.value}</h3>
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

export default connect()(withProfile(Profile, true))
