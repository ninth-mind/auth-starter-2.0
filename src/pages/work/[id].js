import React from 'react'
import { Skeleton } from 'antd'
import { useRouter } from 'next/router'

function Job(props) {
  const router = useRouter()
  console.log(router.query.id)
  return (
    <div className="page job">
      <h1>Job</h1>
      <Skeleton active paragraph={19} />
    </div>
  )
}

export default Job
