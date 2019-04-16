import App, { Container } from 'next/app'
import React from 'react'
import Head from 'next/head'
import withReduxStore from '~/lib/with-redux-store'
import { Provider } from 'react-redux'
import { StripeProvider } from 'react-stripe-elements'
import Layout from '~/layouts/Layout'
import '~/styles/main.scss'

class MyApp extends App {
  constructor(props) {
    super(props)
    this.state = { stripe: null }
  }
  componentDidMount() {
    this.setState({ stripe: window.Stripe('pk_test_tZ1UTEHPHFd9dsZzi03UyKNB') })
  }
  render() {
    const { Component, pageProps, reduxStore } = this.props
    return (
      <StripeProvider stripe={this.state.stripe}>
        <Container>
          <Head>
            <title>Leaderboard!</title>
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width, initial-width=1"
            />
            <script src="https://js.stripe.com/v3/" />
          </Head>

          <Provider store={reduxStore}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Provider>
        </Container>
      </StripeProvider>
    )
  }
}

export default withReduxStore(MyApp)
