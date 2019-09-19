import React from 'react'
import Donuts from '~/assets/sketches/donuts'
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
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cumque
        accusamus deleniti consectetur hic quibusdam dignissimos facere
        voluptate rem adipisci error aut odit blanditiis eligendi, corporis
        quaerat doloribus facilis architecto itaque? Lorem, ipsum dolor sit amet
        consectetur adipisicing elit. Cumque accusamus deleniti consectetur hic
        quibusdam dignissimos facere voluptate rem adipisci error aut odit
        blanditiis eligendi, corporis quaerat doloribus facilis architecto
        itaque?
      </p>
      {pages && pages.length > 0 && <Markdown markup={pages[0].Content} />}
      <Donuts />
    </div>
  )
}

export default Work
