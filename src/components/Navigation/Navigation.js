import React from 'react'
import Link from 'next/link'
import { Layout, Menu, Breadcrumb } from 'antd'
const { Header } = Layout
import { connect } from 'react-redux'

class Navigations extends React.Component {
  render() {
    return (
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={{ lineHeight: '64px' }}
          selectedKeys={[this.props.currentPage]}
        >
          <Menu.Item key="/">
            <Link href="/">Home</Link>
          </Menu.Item>
          <Menu.SubMenu key="/c" title="Login/Register">
            <Menu.Item key="/c/login">
              <Link href="/c">Login</Link>
            </Menu.Item>
            <Menu.Item key="/c/register">
              <Link href="/c/register">Register</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="/buy" disabled>
            <Link href="/buy">Buy</Link>
          </Menu.Item>
          <Menu.Item key="/u">
            <Link href="/u">Account</Link>
          </Menu.Item>
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
