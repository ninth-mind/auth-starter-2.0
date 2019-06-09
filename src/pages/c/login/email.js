import React from 'react'
import axios from 'axios'
import Link from 'next/link'
import { connect } from 'react-redux'
import { redirect, setLoading } from '~/lib/utils'
import { Form, Input, Button, notification } from 'antd'
import '../c.scss'

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
    const { dispatch, form, reCaptcha } = this.props
    let data = form.getFieldsValue()
    //async
    this.setLoading(true)
    const captchaToken = await reCaptcha.execute({ action: 'login' })

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
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
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
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
        <Link href="/c/reset-password">
          <a className="small italic link">Forgot your password?</a>
        </Link>
        <Link href="/c/register">
          <a className="small italic link">Need an account? Register here.</a>
        </Link>
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
