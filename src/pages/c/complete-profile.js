import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import countries from '~/assets/countries'
import { notification, Form, Input, Button, Select } from 'antd'
import { parseJWT, redirect, setLoading, handleError } from '~/lib/utils'
import './c.scss'

// Country Options
const { Option } = Select
const countryOptions = countries.map(c => (
  <Option key={c.code} value={c.code}>
    {c.name}
  </Option>
))

class CompleteProfileForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: '',
      source: '',
      email: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.setLoading = this.setLoading.bind(this)
    this.validateUsername = this.validateUsername.bind(this)
  }

  static async getInitialProps({ query }) {
    return { query }
  }

  componentDidMount() {
    const { query, form } = this.props
    if (query && query.token) {
      let knownUserInfo = parseJWT(query.token)
      this.setState(knownUserInfo)
      form.setFields({
        email: { value: knownUserInfo.email },
        username: { value: knownUserInfo.username }
      })
    }
  }

  setLoading(isLoading) {
    setLoading(isLoading, this.props.dispatch)
  }

  validateUsername(rule, value, cb) {
    if (value.length < 3) cb('Username is too short')
    // TODO: add condition that checks database for existing usernames
    else cb()
  }

  async handleSubmit(e) {
    e.preventDefault()
    // start async process
    const { form, reCaptcha } = this.props
    this.setLoading(true)
    //async
    let data = this.state,
      captchaToken
    try {
      this.setLoading(true)
      let formFields = await form.validateFields()
      data = { ...data, ...formFields }
      this.setLoading(true)
      captchaToken = await reCaptcha.execute({ action: 'complete-profile' })
    } catch (err) {
      handleError(err)
      return
    }
    // send request
    axios({
      method: 'post',
      url: `/api/auth/complete-profile`,
      data: { ...data, recaptcha: captchaToken }
    })
      .then(r => {
        notification.open({
          message: 'Email Confirmation sent',
          description: `An email was sent to ${
            data.email
          }. Check your email to complete the registration process.`,
          duration: 0
        })
        redirect(`/c/confirmation?email=${r.data.data.accepted[0]}`)
      })
      .catch(err => {
        const opts = {
          message: 'Error',
          description: 'Oops! Something went wrong.'
        }
        if (err && err.response && err.response.data)
          opts.description = err.response.data.msg
        notification.error(opts)
        form.resetFields()
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
    const s = this.state
    return (
      <div id="complete-profile" className="complete-profile page center">
        <h1>Complete Profile</h1>
        <p>
          There are just a few more things we need to complete your profile.
        </p>
        <h3>ID: {s.id}</h3>
        <h3>Source: {s.source}</h3>
        <Form className="form" {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="Username" hasFeedback>
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: 'Please input your username.'
                },
                {
                  validator: this.validateUsername
                }
              ]
            })(<Input />)}
          </Form.Item>
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
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  profile: state.profile,
  query: ownProps.query
})

const WrappedCompleteProfileForm = Form.create({ name: 'complete-profile' })(
  CompleteProfileForm
)
export default connect(mapStateToProps)(WrappedCompleteProfileForm)
