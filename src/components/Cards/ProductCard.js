import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button, Icon, InputNumber, Tag } from 'antd'
import './Card.scss'
import { actions } from '../../store'

function Card(props) {
  let [quantity, setQuantity] = useState(1)
  let [disabled, setDisabled] = useState(false)
  const { dispatch, id, products } = props

  let isInCart = products && products.find(p => p.id == id)

  function addToCart() {
    setTimeout(() => setDisabled(false), 2000)
    setDisabled(true)
    setQuantity(1)
    dispatch({
      type: actions.ADD_TO_CART,
      productId: props.id,
      title: props.title,
      quantity: quantity,
      price: props.price
    })
  }

  let imgsrc = props.image
    ? `http://localhost:1337/${props.image[0].url}`
    : `http://placehold.it/100x100`
  let tagBadges = []
  if (props.categories) {
    tagBadges = props.categories.map((e, i) => (
      <Tag key={e.id} color="red">
        {e.name}
      </Tag>
    ))
  }

  return (
    <div className="product-card">
      <div className="cart__main">
        <h2>{props.title}</h2>
        <img className="product-image" src={imgsrc} />
        <div className="product__description">{props.description}</div>
      </div>
      <div className="card__foot">
        <div className="product-details">
          <div className="product-details__meta">
            <h2 className="product-details__price">${props.price}</h2>
            <p>{props.stock} left</p>
          </div>
          <div>{tagBadges}</div>
          <div className="product-details__options">
            <label>Quantity</label>
            <InputNumber
              label=""
              min={1}
              max={Math.min(props.stock, 5)}
              defaultValue={1}
              value={quantity}
              onChange={v => setQuantity(v)}
            />
          </div>
        </div>
        <div className="card__actions">
          <AddToCartButton
            id={props.id}
            stock={props.stock}
            quantity={quantity}
            onClick={addToCart}
            products={products}
            disabled={disabled}
          />
          {isInCart && (
            <span className="product-cart-status">
              <Icon className="is-in-cart check-icon" type="check-circle" />
              added
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function AddToCartButton({ stock, quantity, onClick, disabled }) {
  return (
    <Button
      className="product__action"
      type="primary"
      onClick={onClick}
      disabled={stock <= 0 || disabled}
    >
      {stock > 0 ? (
        <span>Add {quantity > 1 ? `${quantity} ` : ''}to Cart</span>
      ) : (
        <span>Out of Stock</span>
      )}
    </Button>
  )
}

const mapStateToProps = state => ({
  products: state.cart.products
})

export default connect(mapStateToProps)(Card)
