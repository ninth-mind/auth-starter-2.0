import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

export const RecaptchaContext = React.createContext()

const initialState = {
  constants: {
    CAPTCHA_SITE_KEY: '6Le87Z0UAAAAALKPzIW8DiLMEzSi9I51FNTnWBQN' // v3 site key
  },
  ui: {
    isLoading: false,
    currentPage: '/'
  },
  profile: {
    username: null,
    email: null,
    value: null,
    source: null,
    id: null,
    token: null
  }
}

export const actions = {
  LOADING: 'LOADING',
  // AUTH
  CREDS: 'CREDS',
  PROFILE: 'PROFILE',
  LOGOUT: 'LOGOUT',
  VALUE: 'SET_VALUE'
}

function applicationReducer(state = initialState, action) {
  return {
    constants: state.constants,
    ui: uiReducer(state.ui, action),
    profile: profileReducer(state.profile, action)
  }
}

function profileReducer(state = initialState.profile, action) {
  switch (action.type) {
    case actions.CREDS: {
      return {
        ...state,
        username: action.username,
        source: action.source,
        email: action.email,
        value: action.value,
        token: action.token,
        id: action.id
      }
    }
    case actions.VALUE: {
      return {
        ...state,
        value: action.value
      }
    }
    case actions.PROFILE: {
      let dup = { ...action }
      delete dup.type
      return {
        ...state,
        ...dup
      }
    }
    case actions.LOGOUT: {
      return initialState.profile
    }
    default: {
      return state
    }
  }
}

function uiReducer(state = initialState.ui, action) {
  switch (action.type) {
    case actions.LOADING: {
      return { ...state, isLoading: action.isLoading }
    }
    default: {
      return state
    }
  }
}

export function initializeStore(initialState = initialState) {
  return createStore(
    applicationReducer,
    initialState,
    composeWithDevTools(applyMiddleware())
  )
}
