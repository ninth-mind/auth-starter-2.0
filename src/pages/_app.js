import React from 'react'
import { Provider } from 'react-redux'
import Router from 'next/router'
import App from 'next/app'
import Head from 'next/head'
import axios from 'axios'
import MainLayout from '~/components/Layout'
import { actions, initializeStore } from '~/store'
import { setLoading } from '~/lib/utils'
import '~/styles/main.scss'

class MyApp extends App {
  constructor(props) {
    super(props)
    this.store = initializeStore({})
  }

  componentDidMount() {
    console.log('COMPONENT MOUNTED')
    const dispatch = this.store.dispatch
    // Initialize Router
    Router.events.on('routeChangeStart', () => setLoading(true, dispatch))
    Router.events.on('routeChangeComplete', () => setLoading(false, dispatch))
    Router.events.on('routeChangeError', () => setLoading(false, dispatch))

    /**
     * FETCH USER PROFILE TO DETERMINE IF USER IS LOGGED IN
     */
    axios({
      method: 'get',
      url: '/api/me'
    })
      .then(r => {
        const { user, token } = r.data.data
        dispatch({
          type: actions.PROFILE,
          ...user
        })
      })
      .catch(err => {
        if (err?.request?.status !== 403)
          console.log('ERROR FETCHING PROFILE', err)
      })
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <Head>
          <title>Your Cool App</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>

        <Provider store={this.store}>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </Provider>
      </>
    )
  }
}

export default MyApp
