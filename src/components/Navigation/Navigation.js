import React from 'react'
import Link from 'next/link'

class Navigations extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <nav>
        <ul>
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href="/login">
              <a>Login</a>
            </Link>
          </li>
          <li>
            <Link href="/register">
              <a>Register</a>
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
