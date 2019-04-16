import React from 'react'
import Link from 'next/link'
import './Navigation.scss'

class Navigations extends React.Component {
  render() {
    return (
      <nav className="navigation">
        <ul>
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href="/c">
              <a>Login/Register</a>
            </Link>
          </li>
          <li>
            <Link href="/buy">
              <a>Buy</a>
            </Link>
          </li>
          <li>
            <Link href="/u">
              <a>Profile</a>
            </Link>
          </li>
        </ul>
      </nav>
    )
  }
}

export default Navigations
