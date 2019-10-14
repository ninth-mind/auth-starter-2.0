import React, { useContext } from 'react'
import { RecaptchaContext } from '~/store'
import { connect } from 'react-redux'
import axios from 'axios'
import Link from 'next/link'
import countries from '~/assets/countries'
import { redirect, setLoading, handleError } from '~/lib/utils'
import { Button, Form, Icon, Input, notification, Select, Switch } from 'antd'
import { defaultFormItemLayout } from '~/components/Layout/antLayouts'
import './c.scss'

// Country Options
const { Option } = Select
const countryOptions = countries.map(c => (
  <Option key={c.code} value={c.code}>
    {c.name}
  </Option>
))

function RegistrationForm(props) {
  const { dispatch, form } = props
  let recaptcha = useContext(RecaptchaContext)

  async function handleSubmit(e) {
    e.preventDefault()
    //async
    let data, captchaToken
    try {
      setLoading(true, dispatch)
      data = await form.validateFields()
      captchaToken = await recaptcha.execute({ action: 'register' })
      let r = await axios({
        method: 'post',
        url: `/api/auth/register`,
        data: { ...data, recaptcha: captchaToken }
      })
      notification.open({
        message: 'Email Confirmation sent',
        description: `An email was sent to ${
          data.email
        }. Check your email to complete the registration process.`,
        duration: 0
      })
      redirect('/')
    } catch (err) {
      const opts = {
        message: 'Error',
        description: 'Oops! Something went wrong.'
      }
      if (err && err.response && err.response.data) {
        opts.description = err.response.data.msg
      }
      notification.error(opts)
      form.resetFields()
      return handleError(err)
    } finally {
      setLoading(false, dispatch)
    }
  } // end handleSubmit

  function validatePassword(rule, value, cb) {
    if (!value || value.length < 8) cb('Password must be 8 characters')
    else cb()
  }

  function validateConfirmationPassword(rule, value, cb) {
    const form = props.form
    const password = form.getFieldValue('password')
    if (!value || password !== value) cb('Passwords do not match')
    else cb()
  }

  function validateUsername(rule, value, cb) {
    if (!value || value.length < 3) cb('Username is too short')
    // TODO: add condition that checks database for existing usernames
    else cb()
  }

  // styling
  const { getFieldDecorator } = props.form

  return (
    <div className="register page">
      <h1>Register</h1>
      <Form className="form" {...defaultFormItemLayout} onSubmit={handleSubmit}>
        <Form.Item label="Email">
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
        <Form.Item label="Username" hasFeedback>
          {getFieldDecorator('username', {
            rules: [
              {
                required: true,
                message: 'Please input your username.'
              },
              {
                validator: validateUsername
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Country">
          {getFieldDecorator('country ', {
            rules: [
              {
                required: true,
                message: 'Please select a country'
              }
            ]
          })(
            <Select
              showSearch
              placeholder="Select a Country"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {countryOptions}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Password" hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
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
                validator: validateConfirmationPassword,
                message: 'Passwords do not match'
              }
            ]
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item label="Agreements">
          {getFieldDecorator('agreement', {
            required: true,
            valuePropName: 'checked',
            initialValue: false
          })(
            <Switch
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
            />
          )}
          <p className="small">
            By checking the box above you agree to the{' '}
            <Link href="/legal/terms">
              <a>Terms and Conditions</a>
            </Link>{' '}
            as well as the policies outlined in our{' '}
            <Link href="/legal/privacy">
              <a>Privacy Policy</a>
            </Link>
          </p>
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
      <hr />
      <ul>
        <li>
          <Button type="link" href="/api/auth/facebook/register">
            <Icon type="facebook" />
            Login with Facebook
          </Button>
        </li>
        <li>
          <Button type="link" href="/api/auth/instagram/register">
            <Icon type="instagram" />
            Login with Instagram
          </Button>
        </li>
      </ul>
      <Link href="/c/login">
        <a className="small italic link">Already a member? Login here.</a>
      </Link>
    </div>
  )
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(
  RegistrationForm
)

export default connect()(WrappedRegistrationForm)
