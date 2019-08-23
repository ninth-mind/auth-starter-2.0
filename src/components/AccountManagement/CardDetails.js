import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { handleError, setLoading } from '~/lib/utils'
import { injectStripe } from 'react-stripe-elements'
import { Button, Form, Input, notification } from 'antd'
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement
} from 'react-stripe-elements'
import './CardDetails.scss'

/**
 * Card Details takes automatically has `dispatch, recaptcha, stripe, & form` injected.
 * but REQUIRES an `handleCard` function to execute when `stripeToken` and `recaptcha` have completed,
 * this `handleCard` function should return a message object to be passed to
 * `notification.success`. `handleCard` will
 *
 * the `handleCard` function recieves 3 arguments, the `stripeToken`, `recaptcha`, and `form data`
 *
 * Optionally you can also pass children to the `CardDetails` to add form fields
 * @param {*} props
 */
function CardDetails(props) {
  const { getFieldDecorator } = props.form

  //CSS IN JS STYLES FOR FORM
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 }
    }
  }
  const cardStyles = {
    base: {
      color: 'rgba(0,0,0,0.65)',
      fontSize: '14px',
      '::placeholder': {
        color: 'rgba(0,0,0,0.3)'
      }
    }
  }

  /**
   * HANDLE SUBMIT
   */
  async function handleSubmit(e) {
    // We don't want to let default form submission happen here, which would refresh the page.
    e.preventDefault()
    const { dispatch, recaptcha, stripe, form, handleCard } = props

    let captchaToken, data

    try {
      setLoading(true, dispatch)
      data = await form.validateFields()

      captchaToken = await recaptcha.execute({ action: 'card-details' })
      const { token } = await stripe.createToken({
        name: data.name,
        type: 'card'
      })

      // TODO: If there is not a token, handle appropriately
      if (!token) return new Error('Error creating stripe token')

      let message = await handleCard(token, captchaToken, data)
      console.log(message)
      notification.success(message)
    } catch (err) {
      handleError(err)
      return
    } finally {
      setLoading(false, dispatch)
    }
  }

  console.log(props)
  /**
   * JSX RETURN VALUE
   */
  return (
    <Form
      className="form"
      onSubmit={handleSubmit}
      {...formItemLayout}
      hideRequiredMark={true}
    >
      <Form.Item label="Name on Card">
        {getFieldDecorator('name', {
          rules: [{ required: true }]
        })(<Input placeholder="John Doe" />)}
      </Form.Item>
      <Form.Item label="Card Number">
        <CardNumberElement style={cardStyles} />
      </Form.Item>
      <Form.Item label="Card Expiration">
        <CardExpiryElement style={cardStyles} />
      </Form.Item>
      <Form.Item label="CVC">
        <CardCVCElement style={cardStyles} />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        {props.submitText || 'Submit'}
      </Button>
    </Form>
  )
}

CardDetails.propTypes = {
  handleCard: PropTypes.func.isRequired,
  submitText: PropTypes.string
}
/**
 * EXPORTING
 */
const mapStateToProps = state => ({
  profile: state.profile
})

const wrappedCardDetails = Form.create({ name: 'CardDetails' })(CardDetails)
export default connect(mapStateToProps)(injectStripe(wrappedCardDetails))
