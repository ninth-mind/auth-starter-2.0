import React from 'react'
import { connect } from 'react-redux'
import { withProfile } from '~/components/HOCs'

class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 1,
      name: 'jamie'
    }
  }

  render() {
    return (
      <div className="profile page">
        <h1>Profile {this.state.name}</h1>
        <p>There isn't much here at the moment</p>
        <p onClick={() => this.setState({ value: this.state.value + 1 })}>
          Value: {this.state.value}
        </p>
      </div>
    )
  }
}

export default connect()(withProfile(Profile))
