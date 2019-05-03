import React from 'react'
import axios from 'axios'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { connect } from 'react-redux'
import {
  handleError,
  parseJWT,
  redirect,
  setLoading,
  sanitize
} from '~/lib/utils'

class NewUser extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.setLoading = this.setLoading.bind(this)
    this.clear = this.clear.bind(this)
    this.form // added by ref

    this.state = {
      username: '',
      email: '',
      region: ''
    }
  }

  static async getInitialProps({ query }) {
    return { query }
  }

  componentDidMount() {
    const { query } = this.props
    if (query && query.token) {
      this.setState({
        ...this.state,
        ...parseJWT(query.token)
      })
    }
  }

  clear(inputs) {
    this.setState(
      inputs.reduce((a, f) => {
        a[f] = ''
        return a
      }, {})
    )
    this.form.querySelector(`#${inputs[0]}`).focus()
  }

  setLoading(isLoading) {
    setLoading(isLoading, this.props.dispatch)
  }

  handleChange(e) {
    let id = e.target.id
    let val = e.target.value
    let obj = {}
    obj[id] = val
    this.setState(obj)
  }

  async handleSubmit(e) {
    e.preventDefault()
    // validate inputs
    let sanitary = sanitize(this.state)
    if (!sanitary.valid) {
      toast.warn(`Invalid fields: ${sanitary.invalid.join(', ')}`)
      this.clear(sanitary.invalid)
      return
    }
    // start async process
    this.setLoading(true)
    let data = this.state
    console.log('DATA', data)
    debugger
    const captchaToken = await this.props.reCaptcha.execute({
      action: 'complete-profile'
    })
    // send request
    axios({
      method: 'post',
      url: `/api/auth/complete-profile`,
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
    const s = this.state
    return (
      <div className="register page center">
        <h1>Complete Profile</h1>
        <p>
          There are just a few more things we need to complete your profile.
        </p>
        <h3>ID: {s.id}</h3>
        <h3>Source: {s.source}</h3>
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
              value={s.username || ''}
            />
          </div>
          <div className="form__input-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              required
              onChange={this.handleChange}
              value={s.email || ''}
            />
          </div>
          <div className="form__input-group">
            <label htmlFor="region">Region:</label>
            <input
              id="region"
              type="text"
              required
              onChange={this.handleChange}
              value={s.region || ''}
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

const mapStateToProps = (state, ownProps) => ({
  profile: state.profile,
  query: ownProps.query
})
export default connect(mapStateToProps)(NewUser)
