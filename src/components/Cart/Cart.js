import React from 'react'
import { connect } from 'react-redux'
import { Table } from 'antd'
import './Cart.scss'

function Cart(props) {
  let { dispatch, products } = props

  // function editProduct(productId) {}

  const columns = [
    { title: 'id', dataIndex: 'id' },
    { title: 'Name', dataIndex: 'title' },
    { title: 'Quantity', dataIndex: 'quantity' },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (t, r) => `$${r.price.toFixed(2)}`
    }
  ]

  return (
    <Table
      className="cart-table"
      columns={columns}
      dataSource={products}
      size="small"
      footer={CartFooter}
      pagination={products.length > 10}
    />
  )
}

function CartFooter(d) {
  let total = d.reduce((a, p) => p.price * p.quantity + a, 0)
  return <h3>Total: ${total.toFixed(2)}</h3>
}

const mapStateToProps = state => ({
  products: state.cart.products
})

export default connect(mapStateToProps)(Cart)
