import React from 'react'
import { useStrapi } from '~/lib/hooks'
import { connect } from 'react-redux'
import ProductCard from '~/components/Cards/ProductCard'
import { actions } from '../../store'
import './shop.scss'

function Shop(props) {
  const { dispatch } = props

  let products = useStrapi('products')
  let ps = products.map((p, i) => (
    <ProductCard
      key={p.id}
      id={p.id}
      title={p.name}
      description={p.description}
      image={p.image}
      price={p.price}
      stock={p.stock}
    />
  ))

  return (
    <div className="page shop">
      <h1>Shop</h1>
      <div className="shop__products">
        {(ps.length && ps) || <p>Nothing here yet..</p>}
      </div>
    </div>
  )
}

export default connect()(Shop)
