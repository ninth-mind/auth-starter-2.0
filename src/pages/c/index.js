import React from 'react'
import Link from 'next/link'

class LoginTree extends React.Component {
  render() {
    return (
      <div className="login-tree">
        <ul>
          <li>
            <a href="/api/auth/facebook">Login with Facebook</a>
          </li>
          <li>
            <a href="/api/auth/instagram">Login with Instagram</a>
          </li>
          <li>
            <Link href="/c/login">
              <a>Login with Email/Username</a>
            </Link>
          </li>
        </ul>
      </div>
    )
  }
}

export default LoginTree
