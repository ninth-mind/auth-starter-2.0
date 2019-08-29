import React from 'react'

function Leaderboard(props) {
  const leaders = props.leaders || []
  const leaderEls = leaders.map((l, i) => {
    return (
      <li key={l.username || i}>
        {l.username || l.email} - {l.value}
      </li>
    )
  })
  return <div className="leaderboard">{leaderEls}</div>
}

export default Leaderboard
