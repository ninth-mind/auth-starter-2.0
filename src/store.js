import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

export const RecaptchaContext = React.createContext()

const initialState = {
  constants: {
    CAPTCHA_SITE_KEY: '6Le87Z0UAAAAALKPzIW8DiLMEzSi9I51FNTnWBQN', // v3 site key,
    CMS_URL: 'http://localhost:1337/admin'
  },
  cart: {
    products: []
  },
  ui: {
    isLoading: false,
    currentPage: '/',
    panels: [],
    checkoutDrawerIsVisible: false
  },
  profile: {
    username: null,
    email: null,
    value: null,
    source: null,
    id: null,
    token: null,
    permissions: []
  }
}

export const actions = {
  LOADING: 'LOADING',
  // AUTH
  CREDS: 'CREDS',
  PROFILE: 'PROFILE',
  LOGOUT: 'LOGOUT',
  VALUE: 'SET_VALUE',
  PANEL_TOGGLE: 'PANEL_TOGGLE',
  DRAWER_TOGGLE: 'DRAWER_TOGGLE',
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'ADD_TO_CART',
  EDIT_CART: 'EDIT_CART'
}

function applicationReducer(state = initialState, action) {
  return {
    constants: state.constants,
    ui: uiReducer(state.ui, action),
    profile: profileReducer(state.profile, action),
    cart: cartReducer(state.cart, action)
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
    case actions.PANEL_TOGGLE: {
      const panels = state.panels
      const key = action.title.toLowerCase()
      if (action.state === 'open') {
        // check if it exists then add it
        if (panels.indexOf(key) >= 0) return state
        return { ...state, panels: [...panels, key] }
      } else {
        // remove it from panels array
        let temp = [...panels]
        temp.splice(panels.indexOf(key), 1)
        return {
          ...state,
          panels: temp
        }
      }
    }
    case actions.DRAWER_TOGGLE: {
      return {
        ...state,
        checkoutDrawerIsVisible: action.state || !state.checkoutDrawerIsVisible
      }
    }
    default: {
      return state
    }
  }
}

function cartReducer(state = initialState.cart, action) {
  switch (action.type) {
    case actions.ADD_TO_CART: {
      const { productId, title, quantity, price } = action
      return {
        products: [...state.products, { id: productId, quantity, title, price }]
      }
    }
    case actions.REMOVE_FROM_CART: {
      return {
        ...state,
        checkoutDrawerIsVisible: action.state || !state.checkoutDrawerIsVisible
      }
    }
    case actions.EDIT_CART: {
      return {
        ...state,
        checkoutDrawerIsVisible: action.state || !state.checkoutDrawerIsVisible
      }
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
