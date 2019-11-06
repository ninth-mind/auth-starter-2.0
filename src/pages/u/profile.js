import React from 'react'
import { connect } from 'react-redux'
import { useProfile } from '~/lib/hooks'
import AddValue from '~/components/AddValue'
import { Skeleton } from 'antd'
import { actions } from '~/store'

function Profile(props) {
  const { dispatch } = props
  const p = useProfile({}, true, dispatch)

  let content = <Skeleton avatar active paragraph={{ rows: 2 }} />

  // check if the profile is empty
  if (Object.keys(p).length)
    content = (
      <>
        <h2>Welcome {p.username},</h2>
        <h3>Current Value: {p.value}</h3>
        <AddValue />
      </>
    )

  return (
    <div className="profile page">
      <h1>Profile</h1>
      {content}
    </div>
  )
}

export default connect()(Profile)
