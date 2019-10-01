import React, { useRef, useEffect, useCallback } from 'react'
import Router from 'next/router'
import ReCAPTCHA from 'react-google-recaptcha'
import { connect } from 'react-redux'
import { setLoading } from '~/lib/utils'
import Navigation from '~/components/Navigation'
import { CartDrawer } from '~/components/Cart'
import { Button, Layout, Spin } from 'antd'
import { PanelManager } from '~/components/Panel'
import { RecaptchaContext } from '~/store'
const { Content } = Layout
import './Layout.scss'
import { actions } from '../../store'
import ls from 'local-storage'

function MainLayout(props) {
  const { dispatch, cartItems, cartName } = props
  let recaptcha = useRef(null)

  const init = useCallback(() => {
    // init router
    Router.events.on('routeChangeStart', url => setLoading(true, dispatch))
    Router.events.on('routeChangeComplete', url => setLoading(false, dispatch))
    Router.events.on('routeChangeError', () => setLoading(false, dispatch))

    const cart = ls.get(cartName)
    if (cart) {
      dispatch({
        type: actions.SET_CART,
        data: cart
      })
    }
  }, [cartName, dispatch])

  // initialize router
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
              sitekey={props.captchSiteKey}
              size="invisible"
            />
          </Content>
          <CartDrawer />
          {cartItems > 0 && (
            <Button className="view-cart" type="primary" onClick={toggleCart}>
              View Cart ({cartItems})
            </Button>
          )}
        </Spin>
      </RecaptchaContext.Provider>
    </Layout>
  )
}

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading,
    captchSiteKey: state.constants.CAPTCHA_SITE_KEY,
    cartName: state.constants.CART_NAME,
    cartItems: state.cart.items
  }
}

export default connect(mapStateToProps)(MainLayout)
