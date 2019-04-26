import React from 'react'
import axios from 'axios'
import isEmail from 'validator/lib/isEmail'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { connect } from 'react-redux'
import { redirect, handleError, setLoading } from '~/lib/utils'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
    this.passwordInput // added by ref
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.setLoading = this.setLoading.bind(this)
    this.sanitize = this.sanitize.bind(this)
  }

  sanitize() {
    // TODO: SANITIZE INPUTS
    if (!isEmail(this.state.email)) {
      toast.error('Invalid Email')
      return false
    } else return this.state
  }

  handleChange(e) {
    // for form inputs
    let obj = {}
    let id = e.target.id
    let val = e.target.value
    obj[id] = val
    this.setState({ ...this.state, ...obj })
  }

  setLoading(isLoading) {
    setLoading(isLoading, this.props.dispatch)
  }

  async handleSubmit(e) {
    e.preventDefault()
    let data = this.sanitize()
    if (!data) return // unsanitary inputs

    //async
    this.setLoading(true)
    const captchaToken = await this.props.reCaptcha.execute({ action: 'login' })

    axios({
      method: 'post',
      url: `/api/auth/login`,
      data: { ...data, recaptcha: captchaToken }
    })
      .then(r => {
        this.setLoading(false)
        redirect('/u')
      })
      .catch(err => {
        if (err && err.response && err.response.data) {
          toast.error(err.response.data.msg)
        } else {
          toast.error('Oops. Something went wrong')
          handleError(err)
        }
      })
      .then(() => this.setLoading(false))
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
              <input
                id="email"
                type="text"
                size="30"
                required
                tabIndex="0"
                onChange={this.handleChange}
                value={this.state.email}
              />
            </div>
          </div>
          <div className="form__input-group">
            <div className="password-label">
              <label htmlFor="password">Password</label>
              <Link href="/forgot-password">
                <a className="small italic link" tabIndex="1">
                  Forgot?
                </a>
              </Link>
            </div>
            <input
              id="password"
              type="password"
              size="30"
              onChange={this.handleChange}
              tabIndex="0"
              value={this.state.password}
              ref={n => (this.passwordInput = n)}
            />
          </div>
          <button type="submit" tabIndex="0">
            Submit
          </button>
        </form>
        <Link href="/c/register">
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
    profile: state.profile
  }
}

export default connect(mapStateToProps)(Login)
