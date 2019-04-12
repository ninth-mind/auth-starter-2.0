import React from 'react'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import { signOut } from '~/lib/utils'
import { axiosWCreds, redirect } from '~/lib/utils'
import AddValue from '~/components/AddValue'

class Account extends React.Component {
  constructor(props) {
    super(props)
    this.signOut = this.signOut.bind(this)
  }

  static async getInitialProps(ctx) {
    // if rendered on the server
    try {
      let url,
        headers,
        { req } = ctx
      if (req) {
        url = `${req.protocol}://${req.headers.host}/api/me`
        headers = { cookie: req.headers.cookie }
      } else {
        url = '/api/me'
        let token = ctx.reduxStore.getState().profile.token
        headers = { Authorization: `Bearer ${token}` }
      }
      let r = await axiosWCreds({
        method: 'GET',
        url: url,
        headers: headers
      })
      console.log(r.data.data)
      return r.data.data
    } catch (err) {
      toast.error('Oops. Not authorized yet. Please login')
      redirect('/c/login', ctx)
      return {}
    }
  }

  signOut() {
    const { dispatch } = this.props
    signOut(dispatch)
  }

  render() {
    const name = this.props.fname
    const capName = name.charAt(0).toUpperCase() + name.slice(1)
    return (
      <div className="page">
        <h1>Account</h1>
        <h2>Welcome{this.props.fname ? ' ' + capName : ''},</h2>
        <h4>Email: {this.props.email}</h4>
        <h4>Value: {this.props.value}</h4>
        <p>Nothing here yet....</p>
        <AddValue />
        <button onClick={this.signOut}>Sign Out</button>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    value: state.profile.value || ownProps.value,
    fname: state.profile.fname,
    lname: state.profile.lname,
    email: state.profile.email,
    token: state.profile.token
  }
}

export default connect(mapStateToProps)(Account)
