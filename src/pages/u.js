import React from 'react'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import { signOut } from '~/lib/utils'
import { axiosWCreds, redirect } from '../lib/utils'

class Account extends React.Component {
  constructor(props) {
    super(props)
    this.signOut = this.signOut.bind(this)
  }

  static async getInitialProps(ctx) {
    // if rendered on the server
    let url,
      headers,
      { req } = ctx
    if (req) {
      url = `${req.protocol}://${req.headers.host}/api/me`
      headers = { cookie: req.headers.cookie }
    } else {
      url = '/api/me'
      headers = { Authorization: `Bearer ${this.props.token}` }
    }
    try {
      let r = await axiosWCreds({
        method: 'GET',
        url: url,
        headers: headers
      })
      console.log(r.data)
      return r.data.data
    } catch (err) {
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
        <h4>{this.props.email}</h4>
        <h4>{this.props.phone}</h4>
        <p>
          Currently, there is nothing here. If you are a client contact Jamie to
          discuss what you would like to see on your profile. And since you went
          through all this effort to register, I suppose I can trust you. My
          email is <code>me@jamieskinner.me</code>. If you are not a client of
          mine, and you just happen to register for my site, well then BRAVO!
          Progress through the easter eggs and some secrets might reveal
          themselves here.
        </p>
        <button onClick={this.signOut}>Sign Out</button>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  fname: state.profile.fname,
  lname: state.profile.lname,
  email: state.profile.email,
  phone: state.profile.phone,
  token: state.profile.token,
  ...ownProps
})

export default connect(mapStateToProps)(Account)
