import React from 'react'
import axios from 'axios'
import { config, initializeStore } from '~/store'

const isServer = typeof window === 'undefined'
const __NEXT_REDUX_STORE__ = `${config.APP_NAME.toUpperCase()}_STORE`

function getOrCreateStore(initialStateToSet) {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return initializeStore(initialStateToSet)
  }

  // Create store if unavailable on the client and set it on the window object
  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = initializeStore(initialStateToSet)
  }
  return window[__NEXT_REDUX_STORE__]
}

export default App => {
  return class AppWithRedux extends React.Component {
    static async getInitialProps(appContext) {
      // check if user is logged in and fetch profile
      // if user is logged in, put profile data into store.
      const { ctx } = appContext
      let profile
      if (ctx.req) {
        const { cookies } = ctx.req
        try {
          let token = ''
          if (cookies) token = cookies[config.APP_NAME]
          let r = await axios({
            method: 'get',
            url: `${config.BASE_URL}/api/me`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          const { user } = r.data.data
          const { _id, email, source, permissions, username, value } = user
          profile = { id: _id, email, source, permissions, username, value }
        } catch (err) {
          if (err.response && err.response.status === 403) return {}
          else console.log('Error', err)
        }
      }

      // Get or Create the store with `undefined` as initialState
      // This allows you to set a custom default initialState
      const reduxStore = getOrCreateStore({ profile })

      // Provide the store to getInitialProps of pages
      appContext.ctx.reduxStore = reduxStore

      let appProps = {}
      if (typeof App.getInitialProps === 'function') {
        appProps = await App.getInitialProps(appContext)
      }

      return {
        ...appProps,
        initialReduxState: reduxStore.getState()
      }
    }

    constructor(props) {
      super(props)
      this.reduxStore = getOrCreateStore(props.initialReduxState)
    }

    render() {
      return <App {...this.props} reduxStore={this.reduxStore} />
    }
  }
}
