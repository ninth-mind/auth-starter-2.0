import React from 'react'
import axios from 'axios'
import isEmail from 'validator/lib/isEmail'
import Link from 'next/link'
import ReCAPTCHA from 'react-google-recaptcha'
import { toast } from 'react-toastify'
import { connect } from 'react-redux'
import { handleToken, redirect, handleError } from '~/lib/utils'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      recaptcha: ''
    }
    this.reCaptcha // added by ref
    this.passwordInput // added by ref
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    // for form inputs
    if (e.target) {
      let obj = {}
      let id = e.target.id
      let val = e.target.value
      obj[id] = val
      this.setState({ ...this.state, ...obj })
    } else {
      this.setState(Object.assign(this.state, { recaptcha: e }))
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    const { dispatch } = this.props
    if (isEmail(this.state.email)) {
      axios({
        method: 'post',
        url: `/api/auth/login`,
        data: this.state
      })
        .then(r => {
          handleToken(r.data.token, dispatch)
          redirect('/u')
        })
        .catch(err => {
          // incorrect email or password
          if (
            err &&
            err.request &&
            (err.request.status === 401 || err.request.status === 403)
          ) {
            toast.error('Incorrect credentials.')
            this.passwordInput.value = ''
            this.passwordInput.focus()
            this.reCaptcha.reset()
          } else {
            handleError(err)
          }
        })
    } else {
      toast.error('Invalid Email')
    }
  }

  render() {
    return (
      <div className="login page center">
        <h1>Login</h1>
        <form className="form" onSubmit={this.handleSubmit}>
          <div className="form__input-group">
            <div className="space-between">
              <label htmlFor="email">Email:</label>
            </div>
            <div className="space-out">
              <br />
              <input
                id="email"
                type="text"
                size="30"
                required
                onChange={this.handleChange}
                value={this.state.email}
              />
            </div>
          </div>
          <div className="form__input-group">
            <div className="password-label">
              <label htmlFor="password">Password</label>
              {/* <Link href="/forgot-password">
                <a className="small italic link" tabIndex="1">
                  Forgot?
                </a>
              </Link> */}
            </div>
            <input
              id="password"
              type="password"
              size="30"
              onChange={this.handleChange}
              value={this.state.password}
              ref={n => (this.passwordInput = n)}
            />
          </div>
          <ReCAPTCHA
            ref={n => (this.reCaptcha = n)}
            sitekey={this.props.CAPTCHA_SITE_KEY}
            onChange={this.handleChange}
          />
          <button type="submit" tabIndex="1">
            Submit
          </button>
        </form>
        <Link href="/register">
          <a className="small italic link" tabIndex="1">
            Need an account? Register here.
          </a>
        </Link>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    CAPTCHA_SITE_KEY: state.constants.CAPTCHA_SITE_KEY,
    profile: state.profile
  }
}

export default connect(mapStateToProps)(Login)
