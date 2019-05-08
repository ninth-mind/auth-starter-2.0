import React from 'react'
import axios from 'axios'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { connect } from 'react-redux'
import { redirect, handleError, setLoading, clean } from '~/lib/utils'

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
    this.clear = this.clear.bind(this)
  }

  /**
   * @param {Array} inputs : Array of inputs to clear. The first of which will recieve focus.
   */
  clear(inputs) {
    this.setState(
      inputs.reduce((a, f) => {
        a[f] = ''
        return a
      }, {})
    )
    this.form.querySelector(`#${inputs[0]}`).focus()
  }

  handleChange(e) {
    // for form inputs
    let obj = {}
    let id = e.target.id
    let val = e.target.value
    obj[id] = val
    this.setState(obj)
  }

  setLoading(isLoading) {
    setLoading(isLoading, this.props.dispatch)
  }

  async handleSubmit(e) {
    e.preventDefault()
    // clean inputs
    let data = clean(this.state)
    //async
    this.setLoading(true)
    const captchaToken = await this.props.reCaptcha.execute({ action: 'login' })

    axios({
      method: 'post',
      url: `/api/auth/login`,
      data: { ...data, recaptcha: captchaToken }
    })
      .then(r => redirect('/u'))
      .catch(err => {
        // if user already has an account with a different provider, redirect
        if (err.response.status === 300)
          redirect(`/api/auth/${err.response.data.data.source}`)
        // otherwise raise error message
        else if (err && err.response && err.response.data) {
          toast.error(err.response.data.msg)
          // catch all errors
        } else {
          toast.error('Oops. Something went wrong')
          handleError(err)
        }
      })
      .finally(() => this.setLoading(false))
  }

  render() {
    return (
      <div className="login page center">
        <h1>Login</h1>
        <form className="form" onSubmit={this.handleSubmit}>
          <div className="form__input-group">
            <div className="space-between">
              <label htmlFor="email">Email/Username:</label>
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
              <Link href="/c/reset-password">
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
