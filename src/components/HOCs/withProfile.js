import React from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { redirect } from '~/lib/utils'
import { actions } from '~/store'
import { connect } from 'react-redux'

export default function withProfile(Component) {
  //component start
  class PrivateRoute extends React.Component {
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

    render() {
      return <Component {...this.props} />
    }
  } // component end

  const mapStateToProps = (state, ownProps) => {
    return {
      profile: state.profile,
      initialProfile: ownProps.profile
    }
  }

  return connect(mapStateToProps)(PrivateRoute)
}
