import React from 'react'

class Leaderboard extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let leaders = this.props.leaders || []
    let leaderEls = leaders.map((l, i) => {
      return (
        <li key={l.email}>
          {l.email} - {l.value}
        </li>
      )
    })
    return <div className="leaderboard">{leaderEls}</div>
  }
}

export default Leaderboard
