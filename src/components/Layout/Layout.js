import React, { useRef, useEffect, useCallback } from 'react'
import Router from 'next/router'
import ReCAPTCHA from 'react-google-recaptcha'
import { connect } from 'react-redux'
import { setLoading } from '~/lib/utils'
import Navigation from '~/components/Navigation'
import { CartDrawer } from '~/components/Cart'
import Footer from '~/components/Footer'
import { Button, Layout, Spin } from 'antd'
import { PanelManager } from '~/components/Panel'
import { RecaptchaContext, config } from '~/store'
const { Content } = Layout
import './Layout.scss'
import { actions } from '../../store'

/**
 * THE MAIN LAYOUT
 *
 * Main layout is loaded in the root of the app. meaning this code gets executed on
 * every page. This is where router initialization happens, and other important
 * site-wide set up occurs.
 * @param {*} props
 */
function MainLayout(props) {
  const { CAPTCHA_SITE_KEY } = config
  const { dispatch, cartItems } = props
  // console.log('profile', profile)

  let recaptcha = useRef(null)

  // initialize router events
  const init = useCallback(() => {
    Router.events.on('routeChangeStart', url => setLoading(true, dispatch))
    Router.events.on('routeChangeComplete', url => setLoading(false, dispatch))
    Router.events.on('routeChangeError', () => setLoading(false, dispatch))
  }, [dispatch])
  useEffect(init, [])

  function toggleCart() {
    dispatch({
      type: actions.DRAWER_TOGGLE
    })
  }

  return (
    <Layout className="layout">
      <RecaptchaContext.Provider value={recaptcha.current}>
        <Navigation />
        <Spin spinning={props.isLoading} tip="Loading...">
          <Content>
            <PanelManager />
            {props.children}
            <ReCAPTCHA
              ref={recaptcha}
              sitekey={CAPTCHA_SITE_KEY}
              size="invisible"
            />
          </Content>
          <CartDrawer />
          {cartItems > 0 && (
            <Button className="view-cart" type="primary" onClick={toggleCart}>
              View Cart ({cartItems})
            </Button>
          )}
          <Footer />
        </Spin>
      </RecaptchaContext.Provider>
    </Layout>
  )
}

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading,
    cartItems: state.cart.items
  }
}

export default connect(mapStateToProps)(MainLayout)
