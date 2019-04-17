import React from 'react'
import Leaderboard from '~/components/Leaderboard'
import axios from 'axios'
import { connect } from 'react-redux'
class Home extends React.Component {
  constructor(props) {
    super(props)
  }
  static async getInitialProps(ctx) {
    try {
      let url,
        { req } = ctx
      if (ctx.req) {
        url = `${req.protocol}://${req.headers.host}/api/leaders`
      } else {
        url = `/api/leaders`
      }
      let res = await axios({
        method: 'get',
        url
      })
      return { leaders: res.data.data || [] }
    } catch {
      return { leaders: [] }
    }
  }

  render() {
    return (
      <div className="page">
        <h1>Leaderboard</h1>
        <Leaderboard leaders={this.props.leaders} />
      </div>
    )
  }
}

export default connect()(Home)
