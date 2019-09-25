import React from 'react'
import Link from 'next/link'
import { useStrapi } from '~/lib/hooks'
import { connect } from 'react-redux'
import ProductCard from '~/components/Cards/ProductCard'
import { actions } from '../../store'

function Shop(props) {
  const { dispatch } = props

  let products = useStrapi('products')
  let ps = products.map((p, i) => (
    <ProductCard
      key={p.id}
      title={p.name}
      description={p.description}
      image={p.image}
      price={p.price}
      stock={p.stock}
    />
  ))

  function toggleDrawer() {
    dispatch({
      type: actions.DRAWER_TOGGLE,
      state: true
    })
  }

  return (
    <div className="page shop">
      <h1>Shop</h1>
      {(ps.length && ps) || <p>Nothing here yet..</p>}
      <a onClick={toggleDrawer}>View Cart</a>
    </div>
  )
}

export default connect()(Shop)
