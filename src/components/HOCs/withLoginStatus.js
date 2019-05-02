import React from 'react'

export default function withLoginStatus(Component, requireLogin) {
  //component start
  class WithLoginStatus extends React.Component {
    render() {
      return <Component {...this.props} />
    }
  }

  return WithLoginStatus
}
