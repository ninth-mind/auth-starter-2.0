import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { actions } from '~/store'
import { Button, Popconfirm } from 'antd'
import { Cart } from '~/components/Cart'
import { withProfile } from '~/components/HOCs'
import { CardDetails, AddressDetails } from '~/components/AccountManagement'

function Checkout(props) {
  const { dispatch, products } = props
  async function handleCardDetails(stripeToken, recaptchaToken, data) {
    let result = await axios({
      method: 'post',
      url: `/api/payment/charge`,
      data: { recaptcha: recaptchaToken, stripeToken, amount: 999 }
    })

    return {
      message: 'Card Charged',
      description: 'You card has been charged'
    }
  }

  function clear() {
    dispatch({ type: actions.CLEAR_CART })
  }

  return (
    <div className="page">
      <h2>What is in your cart:</h2>
      <Cart />
      <Popconfirm title="Are you sure you want to clear?" onConfirm={clear}>
        <Button type="secondary" disabled={products.length <= 0}>
          Clear Cart
        </Button>
      </Popconfirm>
      <CardDetails handleSubmit={handleCardDetails} submitText="Pay" />
      <AddressDetails callback={c => console.log(c)} />
    </div>
  )
}

const mapStateToProps = state => ({
  products: state.cart.products
})

export default connect(mapStateToProps)(withProfile(Checkout, false))
