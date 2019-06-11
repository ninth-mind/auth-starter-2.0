import React from 'react'
import axios from 'axios'
import Link from 'next/link'
import { connect } from 'react-redux'
import { redirect, setLoading, handleError } from '~/lib/utils'
import { notification, Form, Input, Button, Icon } from 'antd'
import './c.scss'

class EmailLogin extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.setLoading = this.setLoading.bind(this)
  }

  /**
   * @param {Array} inputs : Array of inputs to clear. The first of which will recieve focus.
   */

  setLoading(isLoading) {
    setLoading(isLoading, this.props.dispatch)
  }

  async handleSubmit(e) {
    e.preventDefault()
    const { form, reCaptcha } = this.props

    //async
    let data, captchaToken
    try {
      data = await form.validateFields()
      this.setLoading(true)
      captchaToken = await reCaptcha.execute({ action: 'login' })
    } catch (err) {
      handleError(err)
      return
    }

    axios({
      method: 'post',
      url: `/api/auth/login`,
      data: { ...data, recaptcha: captchaToken }
    })
      .then(r => redirect('/u/account'))
      .catch(err => {
        // if user already has an account with a different provider, redirect
        if (err.response.status === 300)
          redirect(`/api/auth/${err.response.data.data.source}`)
        // otherwise raise error message
        else {
          const opts = {
            message: 'Error',
            description: 'Oops! Something went wrong.'
          }
          if (err && err.response && err.response.data)
            opts.description = err.response.data.msg
          notification.error(opts)
        }
      })
      .finally(() => this.setLoading(false))
  }

  render() {
    const { getFieldDecorator } = this.props.form
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
      <div className="login page center">
        <h1>Login</h1>
        <Form className="form" {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="Email/Username">
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: 'Please input username or email'
                }
              ]
            })(<Input />)}
          </Form.Item>
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
          <Form.Item>
            <Link href="/c/reset-password">
              <a className="small italic link">Forgot your password?</a>
            </Link>
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
        <Link href="/c/register">
          <a className="small italic link">Need an account? Register here.</a>
        </Link>
        <hr />
        <ul>
          <li>
            <Button type="link" href="/api/auth/facebook">
              <Icon type="facebook" />
              Login with Facebook
            </Button>
          </li>
          <li>
            <Button type="link" href="/api/auth/instagram">
              <Icon type="instagram" />
              Login with Instagram
            </Button>
          </li>
        </ul>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    profile: state.profile
  }
}

const WrappedLoginForm = Form.create({ name: 'login' })(EmailLogin)
export default connect(mapStateToProps)(WrappedLoginForm)
