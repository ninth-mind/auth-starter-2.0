import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { RecaptchaContext } from '~/store'
import { connect } from 'react-redux'
import { handleError, setLoading } from '~/lib/utils'
import { defaultFormItemLayout } from '~/components/Layout/antLayouts'
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
 * but REQUIRES an `handleSubmit` function to execute when `stripeToken` and `recaptcha` have completed,
 * this `handleSubmit` function should return a message object to be passed to
 * `notification.success`. `handleSubmit` will
 *
 * the `handleSubmit` function receives 3 arguments, the `stripeToken`, `recaptcha`, and `form data`
 *
 * Optionally you can also pass children to the `CardDetails` to add form fields
 * @param {*} props
 */
function CardDetails(props) {
  const { form, dispatch, stripe, handleSubmit, isSubmitting } = props

  const recaptcha = useContext(RecaptchaContext)

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
  async function submit(e) {
    // We don't want to let default form submission happen here, which would refresh the page.
    if (e) e.preventDefault()

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

      let message = await handleSubmit(token, captchaToken, data)
      console.log(message)
      notification.success(message)
    } catch (err) {
      handleError(err)
      return
    } finally {
      setLoading(false, dispatch)
    }
  }

  const { getFieldDecorator } = form
  return (
    <Form
      className="form"
      onSubmit={submit}
      {...defaultFormItemLayout}
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
  handleSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool.isRequired,
  displaySubmitButton: PropTypes.bool,
  submitText: PropTypes.string
}

CardDetails.defaultProps = {
  handleSubmit: (stripeToken, recaptcha, formData) => {
    console.log({ stripeToken, recaptcha, formData })
  },
  isSubmitting: false,
  displaySubmitButton: true,
  submitText: 'Submit'
}
/**
 * EXPORTING
 */
const mapStateToProps = state => ({
  profile: state.profile
})

const wrappedCardDetails = Form.create({ name: 'CardDetails' })(CardDetails)
export default connect(mapStateToProps)(injectStripe(wrappedCardDetails))
