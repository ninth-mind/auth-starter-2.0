import React from 'react'
import { connect } from 'react-redux'
import { withProfile } from '~/components/HOCs'
import AddValue from '~/components/AddValue'

function Profile(props) {
  const p = props.profile
  return (
    <div className="profile page">
      <h1>Profile</h1>
      <h2>Welcome {p.username},</h2>
      <h3>Current Value: {p.value}</h3>
      <AddValue />
    </div>
  )
}

export default connect()(withProfile(Profile))
