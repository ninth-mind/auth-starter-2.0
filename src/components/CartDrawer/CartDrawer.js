import React from 'react'
import { connect } from 'react-redux'
import { Button, Drawer } from 'antd'
import Link from 'next/link'
import { actions } from '~/store'

function CartDrawer(props) {
  const { dispatch, isVisible } = props

  function toggleDrawer() {
    dispatch({
      type: actions.DRAWER_TOGGLE
    })
  }

  return (
    <Drawer
      title="Checkout"
      width={520}
      closable={true}
      visible={isVisible}
      onClose={toggleDrawer}
    >
      <Link href="/shop/checkout">
        <Button type="primary">Checkout</Button>
      </Link>
      <Button type="primary" onClick={toggleDrawer}>
        close
      </Button>
    </Drawer>
  )
}

const mapStateToProps = state => ({
  isVisible: state.ui.checkoutDrawerIsVisible
})

export default connect(mapStateToProps)(CartDrawer)
