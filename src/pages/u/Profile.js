import React from 'react'
import { connect } from 'react-redux'
import { withProfile } from '~/components/HOCs'
import AddValue from '~/components/AddValue'

class Profile extends React.Component {
  render() {
    return (
      <div className="profile page">
        <h1>Profile {this.state.name}</h1>
        <p>There isn't much here at the moment</p>
        <AddValue />
      </div>
    )
  }
}

export default connect()(withProfile(Profile))
