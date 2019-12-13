import React from 'react'
import { Skeleton } from 'antd'
import { useRouter } from 'next/router'
import { useStrapi } from '~/lib/hooks'
import { Markdown } from 'react-showdown'

function Job(props) {
  const router = useRouter()
  const data = useStrapi(`/pages/${router.query.id}`)
  return (
    <div className="page job">
      <h1>Job</h1>
      {!data.content ? <Skeleton active /> : <Markdown markup={data.content} />}
    </div>
  )
}

export default Job
