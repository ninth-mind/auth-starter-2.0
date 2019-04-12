import { actions } from '~/store'
import validator from 'validator'
import ls from 'store'
import axios from 'axios'
import Router from 'next/router'

export const axiosWCreds = axios.create()

/**
 * Programatic redirect
 * @param {OBJECT} ctx - ctx object from 'getInitialProps'
 * @param {STRING} loc - path to redirect to
 */
export function redirect(path, ctx) {
  if (ctx && ctx.res) {
    ctx.res.writeHead(302, { Location: path })
    ctx.res.end()
  } else {
    Router.push(path)
  }
}

export function validPassword(password) {
  try {
    let pass = validator.trim(password)
    let blacklisted = validator.blacklist(pass, `\\[\\]\\\\<>,/:;"'{}|+=()~`)
    return (
      password.length >= 8 &&
      validator.isAscii(pass) &&
      blacklisted.length === password.length
    )
  } catch (err) {
    return false
  }
}

export function validName(name) {
  let blacklisted = validator.blacklist(name, `\\[\\]\\\\<>,/:;"'{}|+=()~`)
  return (
    blacklisted.length === name.length &&
    name.split(' ').reduce((a, n) => a && validator.isAlpha(n), true)
  )
}

export function parseJWT(token) {
  try {
    let base64Url = token.split('.')[1]
    let base64 = base64Url.replace('-', '+').replace('_', '/')
    return JSON.parse(window.atob(base64))
  } catch (err) {
    return false
  }
}

export function handleToken(token, dispatch) {
  if (token) {
    let stored = ls.get('profile')
    if (stored) stored.token = token
    ls.set('profile', stored || { token })
    let { email, fname, lname, id } = parseJWT(token)
    axiosWCreds.defaults.headers.common['Authorization'] = 'Bearer ' + token
    // axiosWCreds.defaults.headers['Allowed-Privileges'] = privileges
    //   ? privileges.join(' ').toUpperCase()
    //   : ''
    dispatch({
      type: actions.CREDS,
      token,
      email,
      fname,
      lname,
      id
    })
  } else {
    signOut(dispatch)
  }
}

export function signOut(dispatch) {
  axiosWCreds({
    method: 'GET',
    url: '/api/auth/logout'
  })
    .then(r => {
      let stored = ls.get('profile')
      if (stored) delete stored.token
      ls.set('profile', stored)
      dispatch({
        type: actions.LOGOUT
      })
      redirect('/')
    })
    .then(() => (axiosWCreds.defaults.headers.common['Authorization'] = null))
    .catch(err => handleError(err))
}

export function handleError(err) {
  axios({
    url: '/api/error/report',
    method: 'post',
    data: err
  })
    .then(() => console.log(`~~~ Error reported ~~~~~`, err))
    .catch(() => console.log('Error reporting error ~~~~~ facepalm', err))
}

export function debounce(func, wait, immediate) {
  let timeout
  return function() {
    let context = this
    let args = arguments

    let later = function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }

    let callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}
