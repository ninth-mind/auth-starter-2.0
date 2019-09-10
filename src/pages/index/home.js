import React from 'react'
import Leaderboard from '~/components/Leaderboard'
import axios from 'axios'
import { connect } from 'react-redux'
function Home(props) {
  return (
    <div className="page">
      <h1>Auth Starter</h1>
      <Leaderboard leaders={props.leaders} />
    </div>
  )
}

Home.getInitialProps = async ctx => {
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

export default connect()(Home)
