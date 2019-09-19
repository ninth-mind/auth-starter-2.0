import React from 'react'
import { Button } from 'antd'
import './Card.scss'

function Card(props) {
  let imgsrc = props.image
    ? `http://localhost:1337/${props.image.url}`
    : `http://placehold.it/100x100`

  return (
    <div className="product-card">
      <h2>{props.title}</h2>
      <img src={imgsrc} width="100" height="100" />
      <div className="card__description">{props.description}</div>
      <p>
        <strong>${props.price}</strong>
      </p>
      <p>{props.stock} left</p>
      <Button type="primary">Add to Cart</Button>
    </div>
  )
}

export default Card
