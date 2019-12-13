import React from 'react'
import { connect } from 'react-redux'
import { Icon, InputNumber, Popconfirm, Table } from 'antd'
import './Cart.scss'
import { actions } from '../../store'

function Cart(props) {
  let { dispatch, products } = props

  const columns = [
    { title: 'id', dataIndex: 'id' },
    { title: 'Name', dataIndex: 'title' },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      render: QuantityChanger
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (t, r) => {
        return `$${r.price.toFixed(2)}`
      }
    },
    {
      title: <Icon type="delete" />,
      dataIndex: 'delete',
      render: DeleteIcon
    }
  ]

  function DeleteIcon(t, p) {
    function handleDelete() {
      dispatch({
        type: actions.REMOVE_FROM_CART,
        id: p.id
      })
    }

    return (
      <Popconfirm title="Sure to delete?" onConfirm={handleDelete}>
        <Icon type="delete" style={{ color: 'red' }} />
      </Popconfirm>
    )
  }

  function QuantityChanger(t, p) {
    function updateQuantity(v) {
      dispatch({
        type: actions.EDIT_CART,
        id: p.id,
        quantity: v
      })
    }

    return (
      <InputNumber value={p.quantity} size="small" onChange={updateQuantity} />
    )
  }

  return (
    <Table
      className="cart-table"
      columns={columns}
      dataSource={products}
      size="small"
      footer={() => <h2>Total: ${props.total.toFixed(2)}</h2>}
      pagination={products.length > 10}
      rowKey={r => r.id}
    />
  )
}

const mapStateToProps = state => ({
  products: state.cart.products,
  total: state.cart.total,
  items: state.cart.items
})

export default connect(mapStateToProps)(Cart)
