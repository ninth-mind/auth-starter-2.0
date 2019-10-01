import React from 'react'
import axios from 'axios'
import { notification } from 'antd'
import { redirect } from '~/lib/utils'
import { actions } from '~/store'
import { connect } from 'react-redux'

/**
 *
 * @param {function} Component - Component to wrap with profile information
 * @param {boolean} blocking - boolean value whether or not to reroute on error
 */
export default function withProfile(Component, blocking) {
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
            headers: req.headers.cookie ? { cookie: req.headers.cookie } : {}
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
        return { error: err.response.data }
      }
    }

    componentDidMount() {
      const { dispatch, initialProfile, error } = this.props

      // only reroute if it is blocking
      if (error && blocking) {
        redirect('/')
        notification.error({
          message: 'Oops',
          description: error.msg,
          duration: 0
        })
        return
      }

      if (!error) {
        dispatch({
          type: actions.PROFILE,
          username: initialProfile.username,
          email: initialProfile.email,
          id: initialProfile.id,
          value: initialProfile.value,
          source: initialProfile.source,
          permissions: initialProfile.permissions
        })
      }
    }

    render() {
      if (this.props.error && blocking) return <p>Not authorized</p>
      else return <Component {...this.props} />
    }
  } // component end

  const mapStateToProps = (state, ownProps) => {
    return {
      error: ownProps.error,
      profile: state.profile,
      initialProfile: ownProps.profile
    }
  }

  return connect(mapStateToProps)(PrivateRoute)
}
