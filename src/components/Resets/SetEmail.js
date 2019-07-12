import React from 'react'
import { notification, Form, Input, Button } from 'antd'
import { connect } from 'react-redux'
import { handleError, setLoading, redirect, signOut } from '~/lib/utils'
import axios from 'axios'

function SetEmail(props) {
  const {
    dispatch,
    form,
    recaptcha,
    form: { getFieldDecorator }
  } = props

  function checkEmailsMatch(rule, value, cb) {
    const email = form.getFieldValue('email')
    if (!value || value !== email) cb('Emails do not match')
    else cb()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    let data, captchaToken

    //async
    try {
      data = await form.validateFields()
      setLoading(true, dispatch)
      captchaToken = await recaptcha.execute({ action: 'login' })
    } catch (err) {
      setLoading(false, dispatch)
      handleError(err)
      return
    }

    axios({
      method: 'post',
      url: `/api/me/email`,
      data: { ...data, recaptcha: captchaToken }
    })
      .then(r => {
        signOut(dispatch)
        notification.success({
          message: 'Email Changed',
          description: `We sent you an email confirmation to ${
            data.email
          }. Please confirm your new email to continue.`
        })
        redirect('/')
      })
      .catch(err => {
        // if user already has an account with a different provider, redirect
        if (err.response.status === 300) {
          redirect(`/api/auth/${err.response.data.data.source}`)
          // otherwise raise error message
        } else {
          const opts = {
            message: 'Error',
            description: 'Oops! Something went wrong.'
          }
          if (err && err.response && err.response.data)
            opts.description = err.response.data.msg
          notification.error(opts)
        }
      })
      .finally(() => setLoading(false, dispatch))
  }

  // Render opts:
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
    <div>
      <h1>Change Email</h1>
      <p>
        <strong>Note:</strong> This will not change the email associated with
        any connected social accounts. This will only change your email
        connected to this service.
      </p>
      <Form className="form" {...formItemLayout} onSubmit={handleSubmit}>
        <Form.Item label="New Email">
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
        <Form.Item label="Confirm Email">
          {getFieldDecorator('confirm-email', {
            rules: [
              {
                required: true,
                validator: checkEmailsMatch,
                message: 'Emails do not match'
              }
            ]
          })(<Input />)}
        </Form.Item>
        {props.profile.source === 'email' && (
          <Form.Item label="Password">
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: 'Please input your password!'
                }
              ]
            })(<Input.Password />)}
          </Form.Item>
        )}
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </div>
  )
}

const mapStateToProps = state => ({
  profile: state.profile
})

const WrappedSetEmail = Form.create({ name: 'change-email' })(SetEmail)
export default connect(mapStateToProps)(WrappedSetEmail)
