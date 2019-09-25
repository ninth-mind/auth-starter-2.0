import React from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import { signOut } from '~/lib/utils'
import { Button, Icon, Layout, Menu } from 'antd'
import { actions } from '../../store'
const { Header } = Layout

function Navigations(props) {
  const { dispatch } = props

  function handleSignOut() {
    const { dispatch } = props
    signOut(dispatch)
  }

  function openPanel(title) {
    dispatch({
      type: actions.PANEL_TOGGLE,
      state: 'open',
      title: title
    })
  }

  return (
    <Header>
      <Menu
        mode="horizontal"
        style={{ lineHeight: '64px' }}
        selectedKeys={[props.currentPage]}
        theme="dark"
      >
        <Menu.Item key="/">
          <Link href="/">
            <span>
              <Icon type="star" />
              Home
            </span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/c/login">
          <Link href="/c/login">
            <a>Login/Register</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="shop">
          <Link href="/shop">
            <a>Shop</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="work">
          <Link href="/work">
            <a>Work</a>
          </Link>
        </Menu.Item>
        <Menu.SubMenu title={<Icon type="meh" />}>
          <Menu.Item key="donut">
            <a onClick={() => openPanel('donut')}>Donut</a>
          </Menu.Item>
          <Menu.Item key="words">
            <a onClick={() => openPanel('word')}>Words</a>
          </Menu.Item>
        </Menu.SubMenu>
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
