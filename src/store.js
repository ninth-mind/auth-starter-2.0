import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import ls from 'local-storage'

export const RecaptchaContext = React.createContext()

export const config = {
  BASE_URL: 'http://localhost:3000',
  APP_NAME: 'jamieskinner.me',
  CART_NAME: 'jamieskinner.me-cart',
  CAPTCHA_SITE_KEY: '6Le87Z0UAAAAALKPzIW8DiLMEzSi9I51FNTnWBQN', // v3 site key,
  CMS_URL: 'http://localhost:1337/admin'
}

export const initialState = {
  cart: {
    total: 0,
    items: 0,
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
  CREDS: 'CREDS',
  PROFILE: 'PROFILE',
  LOGOUT: 'LOGOUT',
  VALUE: 'SET_VALUE',
  PANEL_TOGGLE: 'PANEL_TOGGLE',
  DRAWER_TOGGLE: 'DRAWER_TOGGLE',
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FORM_CART',
  EDIT_CART: 'EDIT_CART',
  SET_CART: 'SET_CART',
  CLEAR_CART: 'CLEAR_CART'
}

export const initializeStore = storeFromServer => {
  return initStore({ ...initialState, ...storeFromServer })
}

function initStore(initialState = initialState) {
  return createStore(
    applicationReducer,
    initialState,
    composeWithDevTools(applyMiddleware())
  )
}

//  ___ ___ ___  _   _  ___ ___ ___  ___
// | _ \ __|   \| | | |/ __| __| _ \/ __|
// |   / _|| |) | |_| | (__| _||   /\__ \
// |_|_\___|___/ \___/ \___|___|_|_\|___/
//
function applicationReducer(state = initialState, action) {
  return {
    ui: uiReducer(state.ui, action),
    profile: profileReducer(state.profile, action),
    cart: cartReducer(state.cart, action)
  }
}

function profileReducer(state = initialState.profile, action) {
  switch (action.type) {
    case actions.CREDS: {
      // let cur = ls.get(config.APP_NAME)
      // ls.set(config.APP_NAME, { ...cur, token: action.token })
      return {
        ...state,
        username: action.username,
        source: action.source,
        email: action.email,
        value: action.value,
        id: action.id,
        token: action.token,
        permissions: action.permissions
      }
    }
    case actions.VALUE: {
      return {
        ...state,
        value: action.value
      }
    }
    case actions.PROFILE: {
      let dupe = { ...action }
      delete dupe.type
      return {
        ...state,
        ...dupe
      }
    }
    case actions.LOGOUT: {
      ls.remove(config.APP_NAME)
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
      // determine if it is already in the cart
      let cartIndex = state.products.findIndex(p => p.id === productId)
      let newProducts = [...state.products]
      // if it is, update quantity
      if (cartIndex >= 0) {
        let curQuant = state.products[cartIndex].quantity
        let newProduct = {
          id: productId,
          quantity: curQuant + quantity,
          title,
          price
        }
        newProducts.splice(cartIndex, 1, newProduct)
        // otherwise create it and add it
      } else {
        newProducts.push({ id: productId, quantity, title, price })
      }

      // return updated total, new products
      const cart = {
        items: state.items + quantity,
        total: state.total + price * quantity,
        products: newProducts
      }
      ls.set(config.CART_NAME, cart)
      return cart
    }

    case actions.REMOVE_FROM_CART: {
      let index = state.products.findIndex(e => e.id === action.id)
      let newProducts = [...state.products]
      newProducts.splice(index, 1)
      let cart = {
        ...state,
        total: newProducts.reduce((a, p) => a + p.quantity * p.price, 0),
        items: newProducts.reduce((a, p) => a + p.quantity, 0),
        products: newProducts
      }
      ls.set(config.CART_NAME, cart)
      return cart
    }

    case actions.EDIT_CART: {
      // find index of product to edit
      let index = state.products.findIndex(e => e.id === action.id)
      let curP = state.products[index]
      // get difference between value and desired value
      let diff = action.quantity - curP.quantity
      //create new product
      let newP = { ...curP, quantity: curP.quantity + diff }
      // duplicate product array and replace current entry with updated
      let newProducts = [...state.products]
      newProducts.splice(index, 1, newP)
      const cart = {
        ...state,
        total: newProducts.reduce((a, p) => a + p.quantity * p.price, 0),
        items: newProducts.reduce((a, p) => a + p.quantity, 0),
        products: newProducts
      }
      ls.set(config.CART_NAME, cart)
      return cart
    }

    case actions.SET_CART: {
      return action.cart
    }

    case actions.CLEAR_CART: {
      const emptyCart = {
        total: 0,
        items: 0,
        products: []
      }
      ls.set(config.CART_NAME, emptyCart)
      return emptyCart
    }

    default: {
      return state
    }
  }
}
