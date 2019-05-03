import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import { handleError, setLoading, redirect, sanitize } from '~/lib/utils'
import { ResetPassword, ResetPasswordRequest } from '~/components/ResetPassword'

function ResetPasswordPage(props) {
  async function handleSubmit(e, arg1, arg2) {
    e.preventDefault()
    const { dispatch } = props
    // determine if user is requesting password change or
    // actually changing their password
    const isRequesting = !(arg1 && arg2)
    const payload = isRequesting
      ? { email: arg1 }
      : { password: arg1, confirmation: arg2 }

    try {
      // sanitize inputs
      let sanitary = sanitize(payload)
      if (!sanitary.valid) {
        toast.warn(`Invalid field: ${sanitary.invalid.join(', ')}`)
        return
      }

      setLoading(true, dispatch)
      const captchaToken = await props.reCaptcha.execute({
        action: 'password-reset'
      })

      // make requests
      let r = await axios({
        method: isRequesting ? 'post' : 'put',
        url: '/api/auth/reset-password',
        data: { ...payload, recaptcha: captchaToken }
      })
      toast.success(r.data.msg)
      redirect(isRequesting ? '/' : '/c/login')

      // error handling
    } catch (err) {
      if (err && err.response && err.response.data) {
        toast.error(err.response.data.msg)
      } else {
        toast.error('Oops. Something went wrong')
        handleError(err)
      }
    } finally {
      setLoading(false, dispatch)
    }
  }

  return (
    <div className="password page">
      {props.token ? (
        <ResetPassword handleSubmit={handleSubmit} />
      ) : (
        <ResetPasswordRequest handleSubmit={handleSubmit} />
      )}
    </div>
  )
}

ResetPasswordPage.getInitialProps = async ({ query }) => ({
  token: query.token
})

export default connect()(ResetPasswordPage)
