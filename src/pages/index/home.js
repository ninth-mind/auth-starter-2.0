import React, { useState } from 'react'
import Introduction from './Introduction'
import Link from 'next/link'
import axios from 'axios'
import { connect } from 'react-redux'
import './home.scss'

function Home(props) {
  let [open, setOpen] = useState(false)

  return (
    <div className="page">
      <Introduction open={open} cb={() => setOpen(!open)} />
      <div className={`${open ? 'show' : 'hide'}`}>
        <h3>
          I am a Fullstack Developer, Software Designer, and Artist currently
          working for IBM Design.
        </h3>
        <p>And I know what you are thinking:</p>
        <blockquote>
          <h3>
            "What is with all these shiny donuts? And there is hardly any
            styling on this whole page? This dumb menu is in my way too! You
            said you were a designer. This looks terrible!"
          </h3>{' '}
          <br />- <strong>You</strong> (probably)
        </blockquote>
        <p>
          The short answer is because I think it is <strong>funny</strong> and I
          love J Dilla. Also, there are a lot of benefits to making a site
          really boring. For instance, without a ton of styling and content
          everywhere, my site is inherently responsive. Go ahead, resize the
          window!
        </p>

        <blockquote>
          <h3>"OOOOOOOOOOO! It is so responsive!"</h3> <br />-{' '}
          <strong>You</strong> (probably again...)
        </blockquote>

        <p>
          Not to mention. Not <i>reeaally</i> designing my site leaves me free
          to do a whole lot of other cool projects. Like potentially work on{' '}
          <strong>YOUR</strong> project! That is right people!{' '}
          <strong>I am available for hire.</strong> Play your cards right and
          you could have your own site as good as this one. But probably a lot
          better because I am actually pretty good at my job (despite your first
          impression). If you don't believe me, take a look at this!
        </p>
        <div className="space-out">
          <img
            className="image"
            src="https://sudo-portfolio-space.sfo2.cdn.digitaloceanspaces.com/images/bam/computex.jpg"
            alt="Computex Design Award for Bluemix Availability Monitoring"
          />
          <img
            className="image"
            src="https://sudo-portfolio-space.sfo2.cdn.digitaloceanspaces.com/images/bam/adesign.jpg"
            alt="A'Design Gold Award for Bluemix Availability Monitoring"
          />
        </div>
        <p>
          That's right! <strong>TWO</strong> International Design Awards for
          Bluemix Availability Monitoring (the team I work on at IBM)
        </p>
        <blockquote>
          <h3>"Alright, alright. Take it down a notch"</h3> <br />-{' '}
          <strong>You</strong> (rightfully so)
        </blockquote>

        <p>You're right. Got a little carried away.</p>
        <p>
          Unfortunately, most of my most recent and compelling work is behind a
          big IBM firewall and an NDA. So it makes it tough for me to really
          show off all the cools stuff I've been working on.{' '}
          <strong>BUT</strong> if by some strange stretch of the imagination you
          still aren't convinced by my accolades, you can take a look at some of
          the other resources and determine for yourself.
        </p>
        <p>
          Also... check out the easter eggs, they're fun and you'll learn a lot
          about what I can do.
        </p>
        <ul>
          <li>
            <a href="http://github.com/ninth-mind">Github - @ninth-mind</a>
            <br /> If you wanna see more projects
          </li>
          <li>
            <a href="https://codepen.io/thesuperuser/">
              CodePen - @thesuperuser
            </a>{' '}
            OR <a href="https://ninth-mind.github.io/sandbox/">Sandbox</a>
            <br /> If you like random snippets of code
          </li>
          <li>
            <a href="https://www.instagram.com/thesuperuser/">
              Instagram - @thesuperuser
            </a>
            <br /> If you wanna see some of my art
          </li>
          <li>
            <a href="https://www.linkedin.com/in/thesuperuser/">
              LinkedIn - @thesuperuser
            </a>
            <br /> If you want to see some of my accomplishments
          </li>
          <li>
            <Link href="/static/JamieSkinnerResume.pdf">
              <a>Resume</a>
            </Link>
            <br /> If you want to read about what I've done and stuff
          </li>
        </ul>
      </div>
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
