import React from 'react'
import { connect } from 'react-redux'
import { withProfile } from '~/components/HOCs'
import AddValue from '~/components/AddValue'
import { Button } from 'antd'

class Profile extends React.Component {
  render() {
    return (
      <div className="profile page">
        <p>There isn't much here at the moment</p>
        <Button>Cool Beans</Button>
        <AddValue />
      </div>
    )
  }
}

export default connect()(withProfile(Profile))
