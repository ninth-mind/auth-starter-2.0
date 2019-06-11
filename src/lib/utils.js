import { actions } from '~/store'
import validator from 'validator'
import axios from 'axios'
import Router from 'next/router'

export function setLoading(isLoading, dispatch) {
  dispatch({
    type: actions.LOADING,
    isLoading
  })
}
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

export function clean(inputs) {
  let result = { ...inputs }
  for (let key in inputs) {
    let value = inputs[key]
    // is password
    if (key.match(/pass|confirm/gi)) {
      result[key] = validator.trim(value)
      // if email
    } else if (key.match(/email/gi)) {
      let emun = validator.trim(value)
      let isEmail = validator.isEmail(emun)
      if (isEmail) emun = validator.normalizeEmail(emun)
      result[key] = emun
      //username
    } else if (key.match(/username/gi)) {
      result[key] = validator.trim(value)
    }
  }
  return result
}

/**
 * Parses token into object
 * @param {string} token - token string
 */
export function parseJWT(token) {
  try {
    let base64Url = token.split('.')[1]
    let base64 = base64Url.replace('-', '+').replace('_', '/')
    return JSON.parse(window.atob(base64))
  } catch (err) {
    return false
  }
}

/**
 * Parses and saves token information in store
 * @param {string} token - jwt
 * @param {function} dispatch - react-redux dispatch function
 */
export function handleToken(token, dispatch) {
  if (token) {
    let { email, source, username, id } = parseJWT(token)
    dispatch({
      type: actions.CREDS,
      id,
      token,
      email,
      source,
      username
    })
  } else {
    signOut(dispatch)
  }
}

export function signOut(dispatch) {
  axios({
    method: 'GET',
    url: '/api/auth/logout'
  })
    .then(r => {
      dispatch({
        type: actions.LOGOUT
      })
      redirect('/')
    })
    .catch(err => handleError(err))
}

export function handleError(err) {
  console.error(err)
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
