import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { handleError, redirect, setLoading } from '~/lib/utils'
import { notification, Form, Input, Button } from 'antd'

function PasswordResetRequest(props) {
  async function handleSubmit(e) {
    e.preventDefault()
    const { dispatch, reCaptcha, form } = props
    //async validate and recaptcha
    let data, captchaToken
    try {
      setLoading(true, dispatch)
      data = await form.validateFields()
      setLoading(true, dispatch)
      captchaToken = await reCaptcha.execute({
        action: 'reset-password-request'
      })
    } catch (err) {
      handleError(err)
      return
    }

    // make server requests
    try {
      let r = await axios({
        method: 'post',
        url: '/api/auth/reset-password',
        data: { ...data, recaptcha: captchaToken }
      })
      notification.open({
        message: 'Success',
        description: r.data.msg
      })
      redirect('/')

      // error handling
    } catch (err) {
      const opts = {
        message: 'Error',
        description: 'Oops! Something went wrong.'
      }
      if (err && err.response && err.response.data)
        opts.description = err.response.data.msg
      notification.error(opts)
    } finally {
      setLoading(false, dispatch)
    }
  }

  // for rendering
  const {
    form: { getFieldDecorator }
  } = props
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

  return (
    <div className="password page">
      <h1>Password Reset</h1>
      <p>
        Input your email below and we will send you an email with password reset
        information
      </p>

      <Form className="form" {...formItemLayout} onSubmit={handleSubmit}>
        <Form.Item label="Email" hasFeedback>
          {getFieldDecorator('email', {
            rules: [
              {
                required: true,
                type: 'email',
                message: 'The input is not valid email.'
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </div>
  )
}

const WrappedPasswordResetRequestForm = Form.create({
  name: 'password-reset-request'
})(PasswordResetRequest)

export default connect()(WrappedPasswordResetRequestForm)
