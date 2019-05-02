import React from 'react'
import axios from 'axios'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { connect } from 'react-redux'
import { handleError, validPassword, redirect, setLoading } from '~/lib/utils'

class Register extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      username: '',
      region: '',
      password: '',
      confirm: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.setLoading = this.setLoading.bind(this)
    this.sanitize = this.sanitize.bind(this)
    this.clear = this.clear.bind(this)
    this.form // added by ref
  }

  /**
   * @param {Array} inputs : Array of inputs to clear. The first of which will recieve focus.
   */
  clear(inputs) {
    inputs.forEach(e => (this.form.querySelector(`#${e}`).value = ''))
    this.form.querySelector(`#${inputs[0]}`).focus()
  }

  setLoading(isLoading) {
    setLoading(isLoading, this.props.dispatch)
  }

  handleChange(e) {
    // for form inputs
    let obj = {}
    let id = e.target.id
    let val = e.target.value
    obj[id] = val
    this.setState(obj)
  }

  sanitize() {
    // check if confirmation password matches
    if (this.state.confirm !== this.state.password) {
      toast.warn('Passwords do not match.')
      return false
    }

    if (!validPassword(this.state.password)) {
      this.clear(['password', 'confirm'])
      toast.error(
        'Password must be 8 characters. Special characters allowed are .!@#$%^&*'
      )
      return false
    }

    return this.state
  }

  async handleSubmit(e) {
    e.preventDefault()
    let data = this.sanitize()
    if (!data) return // unsanitary inputs

    // start async process
    this.setLoading(true)
    const captchaToken = await this.props.reCaptcha.execute({
      action: 'register'
    })
    // send request
    axios({
      method: 'post',
      url: `/api/auth/register`,
      data: { ...data, recaptcha: captchaToken }
    })
      .then(r => {
        this.setLoading(false)
        toast.success(
          `Email confirmation sent.
Check your email to complete registration.`
        )
        redirect('/')
      })
      .catch(err => {
        this.setLoading(false)
        if (err && err.response && err.response.data) {
          toast.error(err.response.data.msg)
        } else {
          toast.error('Oops. Something went wrong')
          handleError(err)
        }
      })
  }

  render() {
    return (
      <div className="register page center">
        <h1>Register</h1>
        <form
          className="form"
          id="register"
          onSubmit={this.handleSubmit}
          ref={n => (this.form = n)}
        >
          <div className="form__input-group">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              required
              onChange={this.handleChange}
              value={this.state.username}
            />
          </div>
          <div className="form__input-group">
            <label htmlFor="region">Region:</label>
            <input
              id="region"
              type="text"
              required
              onChange={this.handleChange}
              value={this.state.region}
            />
          </div>
          <div className="form__input-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              size="30"
              required
              onChange={this.handleChange}
              value={this.state.email}
            />
          </div>
          <div className="form__input-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              required
              onChange={this.handleChange}
              value={this.state.password}
            />
          </div>
          <div className="form__input-group">
            <label htmlFor="confirm">Confirm Password:</label>
            <input
              id="confirm"
              type="password"
              required
              onChange={this.handleChange}
              value={this.state.confirm}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
        <Link href="/c/login">
          <a className="small italic link">Already a member? Login here.</a>
        </Link>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  profile: state.profile
})
export default connect(mapStateToProps)(Register)
