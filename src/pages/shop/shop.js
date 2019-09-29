import React from 'react'
import { useStrapi } from '~/lib/hooks'
import ProductCard from '~/components/Cards/ProductCard'
import './shop.scss'

function Shop(props) {
  let productsForSale = useStrapi('products')
  let ps = productsForSale.map((p, i) => (
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

export default Shop
