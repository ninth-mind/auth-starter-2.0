import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button, InputNumber } from 'antd'
import './Card.scss'
import { actions } from '../../store'

function Card(props) {
  let [quantity, setQuantity] = useState(1)
  const { dispatch, id } = props

  function addToCart() {
    dispatch({
      type: actions.ADD_TO_CART,
      product: id,
      quantity: quantity
    })
  }

  let imgsrc = props.image
    ? `http://localhost:1337/${props.image.url}`
    : `http://placehold.it/100x100`

  return (
    <div className="product-card">
      <h2>{props.title}</h2>
      <img className="product-image" src={imgsrc} />
      <div className="card__description">{props.description}</div>
      <div className="product-details">
        <div className="product-details__meta">
          <h2 className="product-details__price">${props.price}</h2>
          <p>{props.stock} left</p>
        </div>
        <div className="product-details__options">
          <label>Quantity</label>
          <InputNumber
            label=""
            min={1}
            max={5}
            defaultValue={1}
            onChange={v => setQuantity(v)}
          />
        </div>
      </div>
      <Button type="primary" onClick={addToCart}>
        Add {quantity > 1 ? `${quantity} ` : ''}to Cart
      </Button>
    </div>
  )
}

export default connect()(Card)
