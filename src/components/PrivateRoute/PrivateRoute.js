import React from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { redirect } from '~/lib/utils'

class PrivateRoute extends React.Component {
  static async getInitialProps(ctx) {
    try {
      let url,
        headers,
        { req } = ctx

      if (req) {
        url = `${req.protocol}://${req.headers.host}/api/auth`
        headers = { cookie: req.headers.cookie }
      } else {
        url = '/api/auth'
      }

      let r = await axios({
        method: 'GET',
        url: url,
        headers: headers
      })
      console.log(r)
      return {}
    } catch (err) {
      toast.error('Oops. Not authorized yet. Please login')
      redirect('/c', ctx)
      return {}
    }
  }

  render() {
    // pass props on
    const childrenWithProps = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, this.props)
    })
    return childrenWithProps
  }
}

export default PrivateRoute
