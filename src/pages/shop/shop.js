import React from 'react'
import Link from 'next/link'
import { useStrapi } from '~/lib/hooks'
import ProductCard from '~/components/Cards/ProductCard'

function Shop(props) {
  let products = useStrapi('products')
  console.log(products)
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

  return (
    <div className="page shop">
      <h1>Shop</h1>
      {(ps.length && ps) || <p>Nothing here yet..</p>}
      <Link href="/shop/checkout">
        <a>Checkout</a>
      </Link>
    </div>
  )
}

export default Shop
