import React, { useState, useContext, useEffect } from 'react'
import { RecaptchaContext } from '~/store'
import axios from 'axios'
import { connect } from 'react-redux'
import { useRouter } from 'next/router'
import Link from 'next/link'
import countries from '~/assets/countries'
import { Button, Form, Icon, Input, notification, Select, Switch } from 'antd'
import { defaultFormItemLayout } from '~/components/Layout/antLayouts'
import { parseJWT, redirect, setLoading } from '~/lib/utils'
import './c.scss'

// Country Options
const { Option } = Select
const countryOptions = countries.map(c => (
  <Option key={c.code} value={c.code}>
    {c.name}
  </Option>
))

function CompleteProfileForm(props) {
  // set variables
  const {
    dispatch,
    form,
    form: { getFieldDecorator }
  } = props

  const router = useRouter()
  const query = router.query

  const initialState = {
    id: '',
    source: '',
    email: ''
  }
  // capture context
  const recaptcha = useContext(RecaptchaContext)

  // set up effects
  // FOR SOME REASON WHEN I PARSE THE TOKEN IN THIS EFFECT
  // I DONT GET A CSS ERROR WHEN POPULATING THE
  // FIELDS WITH THEIR DEFAULT VALUE
  let [knownUserInfo, setKnownUserInfo] = useState(initialState)
  useEffect(() => {
    if (query && query.token) {
      let parseInfo = parseJWT(query.token)
      setKnownUserInfo(parseInfo)
    }
  }, [query])
  // THE ABOVE BIT OF CODE SHOULD BE AS SIMPLE AS
  // let knownUserInfo = parseJWT(query.token)

  // define functions
  function validateUsername(rule, value, cb) {
    if (value.length < 3) cb('Username is too short')
    // TODO: add condition that checks database for existing usernames
    else cb()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    // start async process
    setLoading(true, dispatch)
    let captchaToken,
      data = knownUserInfo
    try {
      let formFields = await form.validateFields()
      data = { ...data, ...formFields }
      captchaToken = await recaptcha.execute({ action: 'complete-profile' })
      // send request to server
      let r = await axios({
        method: 'post',
        url: `/api/auth/complete-profile`,
        data: { ...data, recaptcha: captchaToken }
      })

      notification.open({
        message: 'Email Confirmation sent',
        description: `An email was sent to ${data.email}. Check your email to complete the registration process.`,
        duration: 0
      })
      redirect(`/c/confirmation?email=${r.data.data.accepted[0]}`)
    } catch (err) {
      const opts = {
        message: 'Error',
        description: 'Oops! Something went wrong.'
      }
      if (err && err.response && err.response.data)
        opts.description = err.response.data.msg
      notification.error(opts)
      form.resetFields()
    } finally {
      setLoading(false, dispatch)
    }
  }

  const s = knownUserInfo

  return (
    <div id="complete-profile" className="complete-profile page">
      <h1>Complete Profile</h1>
      <p>There are just a few more things we need to complete your profile.</p>
      <h3>ID: {s.id}</h3>
      <h3>Source: {s.source}</h3>
      <Form className="form" {...defaultFormItemLayout} onSubmit={handleSubmit}>
        <Form.Item label="Username" hasFeedback>
          {getFieldDecorator('username', {
            initialValue: s.username,
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
        <Form.Item label="Email">
          {getFieldDecorator('email', {
            initialValue: s.email,
            rules: [
              {
                required: true,
                type: 'email',
                message: 'The input is not valid email.'
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Country">
          {getFieldDecorator('country ', {
            initialValue: s.country,
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
    </div>
  )
}

const WrappedCompleteProfileForm = Form.create({ name: 'complete-profile' })(
  CompleteProfileForm
)

const mapStateToProps = state => ({
  profile: state.profile
})

export default connect(mapStateToProps)(WrappedCompleteProfileForm)
