import React from 'react'
import { connect } from 'react-redux'
import { handleError, setLoading } from '~/lib/utils'
import { injectStripe } from 'react-stripe-elements'
import { Button, Form, Icon, Input, notification, Switch, Popover } from 'antd'
import axios from 'axios'
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement
} from 'react-stripe-elements'
import './CardDetails.scss'

/**
 * CHECKOUT FORM COMPONENT
 */
function CheckoutForm(props) {
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
      color: 'black',
      fontSize: '16px',
      lineHeight: '27px'
    }
  }

  /**
   * HANDLE SUBMIT
   */
  async function handleSubmit(e) {
    // We don't want to let default form submission happen here, which would refresh the page.
    e.preventDefault()
    const { dispatch, recaptcha, stripe, form } = props

    let captchaToken, data

    try {
      setLoading(true, dispatch)
      data = await form.validateFields()
      console.log(data)
      let path = data.save ? 'charge-save' : 'charge'

      captchaToken = await recaptcha.execute({ action: 'charge' })
      const { token } = await stripe.createToken({
        name: data.name,
        type: 'card'
      })

      // TODO: If there is not a token, handle appropriately

      if (!token) new Error('Error creating stripe token')
      let result = await axios({
        method: 'post',
        url: `/api/payment/${path}`,
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
  }

  /**
   * JSK RETURN VALUE
   */
  return (
    <Form
      className="form"
      onSubmit={handleSubmit}
      {...formItemLayout}
      hideRequiredMark={true}
    >
      <h1>Billing Details</h1>
      <Form.Item label="Name on Card">
        {getFieldDecorator('name', {
          rules: [{ required: true }]
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Address">
        {getFieldDecorator('address', {
          rules: [{ required: true }]
        })(<Input />)}
      </Form.Item>
      <Form.Item label="City">
        {getFieldDecorator('city', {
          rules: [{ required: true }]
        })(<Input />)}
      </Form.Item>
      <Form.Item label="State">
        {getFieldDecorator('state', {
          rules: [{ required: true }]
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Zip">
        {getFieldDecorator('zip', {
          rules: [{ required: true }]
        })(<Input />)}
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
      <Form.Item label="Save Card">
        {getFieldDecorator('save', {
          valuePropName: 'checked',
          initialValue: true
        })(
          <Switch
            checkedChildren={<Icon type="check" />}
            unCheckedChildren={<Icon type="close" />}
          />
        )}
        <Popover
          placement="right"
          content="We do not store any card information directly"
        >
          <Icon className="info-icon" type="info-circle" theme="filled" />
        </Popover>
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Confirm order
      </Button>
    </Form>
  )
}

/**
 * EXPORTING
 */
const mapStateToProps = state => ({
  profile: state.profile
})

const wrappedCheckoutForm = Form.create({ name: 'checkout' })(CheckoutForm)
export default connect(mapStateToProps)(injectStripe(wrappedCheckoutForm))
