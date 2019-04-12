import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

const initialState = {
  constants: {
    CAPTCHA_SITE_KEY: '6Le87Z0UAAAAALKPzIW8DiLMEzSi9I51FNTnWBQN', // v3 site key
    COOKIE_STORAGE_NAME: 'leaderboard'
  },
  ui: {
    isLoading: false
  },
  profile: {
    email: '',
    fname: '',
    lname: '',
    token: '',
    value: '',
    id: ''
  }
}

export const actions = {
  LOADING: 'LOADING',
  // AUTH
  CREDS: 'CREDS',
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
        token: action.token,
        fname: action.fname,
        lname: action.lname,
        email: action.email,
        id: action.id
      }
    }
    case actions.VALUE: {
      return {
        ...state,
        value: action.value
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
