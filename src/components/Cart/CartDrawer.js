import React from 'react'
import { connect } from 'react-redux'
import { Button, Drawer, Popconfirm } from 'antd'
import Link from 'next/link'
import { actions } from '~/store'
import Cart from './Cart'

function CartDrawer(props) {
  const { dispatch, isVisible, products } = props

  function toggleDrawer() {
    dispatch({
      type: actions.DRAWER_TOGGLE
    })
  }

  function clear() {
    dispatch({
      type: actions.CLEAR_CART
    })
  }

  return (
    <Drawer
      title="Cart"
      width={520}
      closable={true}
      visible={isVisible}
      onClose={toggleDrawer}
    >
      <Cart />
      <Link href="/shop/checkout">
        <Button
          type="primary"
          disabled={products.length <= 0}
          onClick={toggleDrawer}
        >
          Checkout
        </Button>
      </Link>
      <Popconfirm title="Are you sure you want to clear?" onConfirm={clear}>
        <Button type="secondary" disabled={products.length <= 0}>
          Clear
        </Button>
      </Popconfirm>
    </Drawer>
  )
}

const mapStateToProps = state => ({
  isVisible: state.ui.checkoutDrawerIsVisible,
  products: state.cart.products
})

export default connect(mapStateToProps)(CartDrawer)
