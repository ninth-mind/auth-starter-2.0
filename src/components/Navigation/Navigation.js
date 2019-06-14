import React from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import { signOut } from '~/lib/utils'
import { Layout, Menu, Icon, Button } from 'antd'
const { Header } = Layout

function Navigations(props) {
  function handleSignOut() {
    const { dispatch } = props
    signOut(dispatch)
  }

  return (
    <Header>
      <Menu
        mode="horizontal"
        style={{ lineHeight: '64px' }}
        selectedKeys={[props.currentPage]}
      >
        <Menu.Item key="/">
          <Link href="/">
            <span>
              <Icon type="star" />
              Leaderboard
            </span>
          </Link>
        </Menu.Item>
        <Menu.SubMenu title="Login/Register">
          <Menu.Item key="/c/login">
            <Link href="/c/login">
              <a>Login</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="/c/register">
            <Link href="/c/register">
              <a>Register</a>
            </Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item key="buy" disabled={!props.isLoggedIn}>
          <Link href="/buy">
            <a>Buy</a>
          </Link>
        </Menu.Item>
        <Menu.SubMenu title={<Icon type="user" />} disabled={!props.isLoggedIn}>
          <Menu.Item key="/u/account">
            <Link href="/u/account">
              <a>Account</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="/u/profile">
            <Link href="/u/profile">
              <a>Profile</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="sign-out">
            <Button type="danger" onClick={handleSignOut}>
              Sign Out
            </Button>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </Header>
  )
}

const mapStateToProps = state => {
  return {
    currentPage: state.ui.currentPage,
    isLoggedIn: state.profile.email
  }
}

export default connect(mapStateToProps)(Navigations)
