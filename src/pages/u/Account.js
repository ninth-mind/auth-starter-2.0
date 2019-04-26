import React from 'react'
import axios from 'axios'
import { actions } from '~/store'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import { signOut, redirect } from '~/lib/utils'
import AddValue from '~/components/AddValue'

class Account extends React.Component {
  constructor(props) {
    super(props)
    this.signOut = this.signOut.bind(this)
  }

  static async getInitialProps(ctx) {
    // if rendered on the server
    try {
      let opts = {},
        { req } = ctx
      if (req) {
        opts = {
          url: `${req.protocol}://${req.headers.host}/api/me`,
          headers: { cookie: req.headers.cookie }
        }
      } else {
        opts = {
          url: '/api/me'
        }
      }

      let r = await axios({
        method: 'GET',
        ...opts
      })

      return { profile: r.data.data }
    } catch (err) {
      toast.error('Oops. Incorrect Permissions')
      redirect('/c', ctx)
      return {}
    }
  }

  componentDidMount() {
    const { dispatch, initialProfile } = this.props
    dispatch({
      type: actions.PROFILE,
      username: initialProfile.username,
      email: initialProfile.email,
      id: initialProfile.id,
      value: initialProfile.value,
      source: initialProfile.source
    })
  }

  signOut() {
    const { dispatch } = this.props
    signOut(dispatch)
  }

  render() {
    const p = this.props.profile
    return (
      <div className="page">
        <h1>Account</h1>
        <h2>Welcome {p.username},</h2>
        <h4>Email: {p.email}</h4>
        <h4>Value: {p.value}</h4>
        <p>Nothing here yet....</p>
        <AddValue />
        <button onClick={this.signOut}>Sign Out</button>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    profile: state.profile,
    initialProfile: ownProps.profile
  }
}

export default connect(mapStateToProps)(Account)
