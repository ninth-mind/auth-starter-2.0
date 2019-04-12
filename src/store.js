import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

const initialState = {
  constants: {
    CAPTCHA_SITE_KEY: '6Le87Z0UAAAAALKPzIW8DiLMEzSi9I51FNTnWBQN', // v3 site key
    COOKIE_STORAGE_NAME: 'rich'
  },
  ui: {
    isLoading: false
  },
  profile: {
    email: '',
    fname: '',
    lname: '',
    token: '',
    id: ''
  }
}

export const actions = {
  LOADING: 'LOADING',
  // AUTH
  CREDS: 'CREDS',
  LOGOUT: 'LOGOUT'
}

function applicationReducer(state = initialState, action) {
  return {
    constants: state.constants,
    ui: uiReducer(state.ui, action),
    profile: authReducer(state.profile, action)
  }
}

function authReducer(state = initialState.profile, action) {
  switch (action.type) {
    case actions.CREDS: {
      //TODO: UPDATE EGGS BASED ON TOKEN INFO
      return {
        ...state,
        token: action.token,
        fname: action.fname,
        lname: action.lname,
        email: action.email,
        id: action.id
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
