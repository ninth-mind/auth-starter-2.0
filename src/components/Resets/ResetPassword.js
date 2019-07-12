import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { setLoading, handleError, redirect } from '~/lib/utils'
import { notification, Form, Input, Button } from 'antd'

function PasswordReset(props) {
  // validate password
  function validatePassword(rule, value, cb) {
    if (value.length < 8) cb('Password must be 8 characters')
    else cb()
  }

  // validate confimation
  function validateConfirmationPassword(rule, value, cb) {
    const form = props.form
    const password = form.getFieldValue('password')
    if (password !== value) cb('Passwords do not match')
    else cb()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const { dispatch, recaptcha, form } = props

    //async validate and recaptcha
    let data, captchaToken
    try {
      setLoading(true, dispatch)
      data = await form.validateFields()
      setLoading(true, dispatch)
      captchaToken = await recaptcha.execute({ action: 'reset-password' })
    } catch (err) {
      handleError(err)
      return
    }

    // make server requests
    try {
      let r = await axios({
        method: 'put',
        url: '/api/auth/reset-password',
        data: { ...data, recaptcha: captchaToken }
      })
      notification.open({
        message: 'Success',
        description: r.data.msg,
        duration: 0
      })
      redirect('/c/login')

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

  // things for rendering
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
      <p>Input your new password below</p>
      <Form className="form" {...formItemLayout} onSubmit={handleSubmit}>
        <Form.Item label="Password" hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Please input your password!'
              },
              {
                validator: validatePassword
              }
            ]
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item label="Confirm Password" hasFeedback>
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: 'Please confirm your password!'
              },
              {
                validator: validateConfirmationPassword,
                message: 'Passwords do not match'
              }
            ]
          })(<Input.Password />)}
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </div>
  )
}

const WrappedPasswordResetForm = Form.create({
  name: 'password-reset'
})(PasswordReset)
export default connect()(WrappedPasswordResetForm)
