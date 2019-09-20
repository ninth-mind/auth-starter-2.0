import React from 'react'
import Link from 'next/link'
import { useStrapi } from '~/lib/hooks'
import { Markdown } from 'react-showdown'

function Work(props) {
  let pages = useStrapi('pages')
  let items = pages.map(page => (
    <li key={page.link}>
      <Link href={`/work/${page.link}`}>
        <a>{page.title}</a>
      </Link>
    </li>
  ))

  return (
    <div className="page work">
      <h1>Work</h1>
      <ul>{items}</ul>
      {pages && pages.length > 0 && <Markdown markup={pages[0].Content} />}
    </div>
  )
}

export default Work
