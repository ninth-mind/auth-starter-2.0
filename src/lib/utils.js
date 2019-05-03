import { actions } from '~/store'
import validator from 'validator'
import axios from 'axios'
import Router from 'next/router'
import { useState } from 'react'

export function handleFormInput(initialValue) {
  let [value, setValue] = useState(initialValue)
  function handleChange(e) {
    setValue(e.target.value)
  }
  return { value, onChange: handleChange }
}

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

/**
 * Validates and object, based on their keys
 * @param {object} inputs - object where they key indicates the type of validation
 *                          for the value
 */
export function sanitize(inputs) {
  let incorrectFields = []
  let result = { ...inputs }
  for (let key in inputs) {
    let value = inputs[key]
    // is password
    if (key.match(/pass|confirm/gi)) {
      let pass = validator.trim(value)
      let whitelisted = validator.whitelist(pass, 'a-zA-Z0-9!@#$%*^-')
      if (
        value.length < 8 ||
        !validator.isAscii(pass) ||
        whitelisted.length !== value.length
      )
        incorrectFields.push(key)
      else result[key] = pass
      // if email
    } else if (key.match(/email/gi)) {
      let email = validator.trim(value)
      let whitelisted = validator.whitelist(email, 'a-zA-Z0-9@._-')
      if (!validator.isEmail(email) || whitelisted.length !== value.length)
        incorrectFields.push(key)
      else result[key] = validator.normalizeEmail(whitelisted)
      //username
    } else if (key.match(/username/gi)) {
      let un = validator.trim(value)
      let whitelisted = validator.whitelist(un, 'a-zA-Z0-9@$!._-')
      if (
        value.length < 3 ||
        !validator.isAscii(un) ||
        whitelisted.length !== value.length
      )
        incorrectFields.push(key)
      else result[key] = validator.trim(value)
    }
  }

  if (incorrectFields.length === 0) return { valid: true, result }
  return { valid: false, invalid: incorrectFields }
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
      let email = validator.trim(value)
      result[key] = validator.normalizeEmail(email)
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
