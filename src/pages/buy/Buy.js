import React from 'react'
import Checkout from '~/components/Checkout'
class Buy extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="page">
        <Checkout />
      </div>
    )
  }
}

export default Buy
