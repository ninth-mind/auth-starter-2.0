import React from 'react'
import Link from 'next/link'
import { Button, Icon } from 'antd'

class LoginTree extends React.Component {
  render() {
    return (
      <div className="login-tree">
        <ul>
          <li>
            <Button type="link" href="/api/auth/facebook">
              <Icon type="facebook" />
              Login with Facebook
            </Button>
          </li>
          <li>
            <Button type="link" href="/api/auth/instagram">
              <Icon type="instagram" />
              Login with Instagram
            </Button>
          </li>
          <li>
            <Link href="/c/login/email">
              <Button type="link">
                <Icon type="user" /> Login with Email/Username
              </Button>
            </Link>
          </li>
        </ul>
      </div>
    )
  }
}

export default LoginTree
