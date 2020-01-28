import React from 'react'
import { Provider } from 'react-redux'
import Router from 'next/router'
import App from 'next/app'
import Head from 'next/head'
import axios from 'axios'
import MainLayout from '~/components/Layout'
import { actions, initializeStore } from '~/store'
import { setLoading } from '~/lib/utils'
import { StripeProvider } from 'react-stripe-elements'
import '~/styles/main.scss'

class MyApp extends App {
  constructor(props) {
    super(props)
    this.state = { stripe: null }
    this.store = initializeStore({})
  }

  componentDidMount() {
    console.log('COMPONENT MOUNTED')
    const dispatch = this.store.dispatch
    // Initialize Router
    Router.events.on('routeChangeStart', () => setLoading(true, dispatch))
    Router.events.on('routeChangeComplete', () => setLoading(false, dispatch))
    Router.events.on('routeChangeError', () => setLoading(false, dispatch))

    dispatch({
      type: actions.SET_CART
    })

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

    // this.setState({ stripe: window.Stripe('pk_test_tZ1UTEHPHFd9dsZzi03UyKNB') })
  }

  render() {
    const { Component, pageProps } = this.props
    console.log('RENDERING')
    return (
      <StripeProvider stripe={this.state.stripe}>
        <>
          <Head>
            <title>Jamie Skinner - Portfolio</title>
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            />
            <script src="https://js.stripe.com/v3/" />
          </Head>

          <Provider store={this.store}>
            <MainLayout>
              <Component {...pageProps} />
            </MainLayout>
          </Provider>
        </>
      </StripeProvider>
    )
  }
}

export default MyApp
