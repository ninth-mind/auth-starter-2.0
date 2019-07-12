import React from 'react'
import { connect } from 'react-redux'
import { handleError, setLoading } from '~/lib/utils'
import { injectStripe } from 'react-stripe-elements'
import { Button, notification } from 'antd'
import axios from 'axios'
import CardSection from './CardSection'

function CheckoutForm(props) {
  async function handleSubmit(e) {
    // We don't want to let default form submission happen here, which would refresh the page.
    e.preventDefault()
    const { dispatch, recaptcha, stripe } = props

    //async validate and recaptcha
    let data, captchaToken
    try {
      setLoading(true, dispatch)
      captchaToken = await recaptcha.execute({ action: 'charge' })
      const { token } = await stripe.createToken({
        name: 'Jenny Rosen',
        type: 'card'
      })
      console.log('TOKEN', token)
      if (!token) new Error('Error creating stripe token')
      let result = await axios({
        method: 'post',
        url: '/api/payment/charge',
        data: { recaptcha: captchaToken, stripeToken: token, amount: 999 }
      })

      console.log(result)
      notification.success({
        message: 'Card Charged',
        description: 'You card has been charged'
      })
    } catch (err) {
      handleError(err)
      return
    } finally {
      setLoading(false, dispatch)
    }

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

  return (
    <form onSubmit={handleSubmit}>
      <h1>Pay Me!</h1>
      <CardSection />
      <Button type="primary" htmlType="submit">
        Confirm order
      </Button>
    </form>
  )
}

const mapStateToProps = state => ({
  profile: state.profile
})

export default connect(mapStateToProps)(injectStripe(CheckoutForm))
