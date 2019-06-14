import React from 'react'
import { injectStripe } from 'react-stripe-elements'
import { Button } from 'antd'
import CardSection from './CardSection'

class CheckoutForm extends React.Component {
  handleSubmit(ev) {
    const { stripe } = this.props
    // We don't want to let default form submission happen here, which would refresh the page.
    ev.preventDefault()

    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    stripe.createToken({ name: 'Jenny Rosen' }).then(({ token }) => {
      console.log('Received Stripe token:', token)
    })

    // However, this line of code will do the same thing:
    //
    // stripe.createToken({type: 'card', name: 'Jenny Rosen'});

    // You can also use createSource to create Sources. See our Sources
    // documentation for more: https://stripe.com/docs/stripe-js/reference#stripe-create-source
    //
    // stripe.createSource({type: 'card', owner: {
    //   name: 'Jenny Rosen'
    // }});
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>Pay Me!</h1>
        <CardSection />
        <Button type="primary">Confirm order</Button>
      </form>
    )
  }
}

export default injectStripe(CheckoutForm)
