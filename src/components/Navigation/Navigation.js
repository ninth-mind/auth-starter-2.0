import React from 'react'
import Link from 'next/link'
import { Layout, Menu, Icon } from 'antd'
const { Header } = Layout
import { connect } from 'react-redux'

class Navigations extends React.Component {
  render() {
    return (
      <Header>
        <Menu
          mode="horizontal"
          style={{ lineHeight: '64px' }}
          selectedKeys={[this.props.currentPage]}
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
          <Menu.Item key="buy" disabled>
            <Link href="/buy">
              <a>Buy</a>
            </Link>
          </Menu.Item>
          <Menu.SubMenu title={<Icon type="user" />}>
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
          </Menu.SubMenu>
        </Menu>
      </Header>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentPage: state.ui.currentPage
  }
}

export default connect(mapStateToProps)(Navigations)
