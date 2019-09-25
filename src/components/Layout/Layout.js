import React, { useRef, useEffect } from 'react'
import Router from 'next/router'
import ReCAPTCHA from 'react-google-recaptcha'
import { connect } from 'react-redux'
import { setLoading } from '~/lib/utils'
import Navigation from '~/components/Navigation'
import CartDrawer from '~/components/CartDrawer'
import { Layout, Spin } from 'antd'
const { Content } = Layout
import { RecaptchaContext } from '~/store'
import './Layout.scss'

function MainLayout(props) {
  const { dispatch } = props
  let recaptcha = useRef(null)

  // initialize router
  useEffect(initializeRouter)
  function initializeRouter() {
    Router.events.on('routeChangeStart', url => setLoading(true, dispatch))
    Router.events.on('routeChangeComplete', url => setLoading(false, dispatch))
    Router.events.on('routeChangeError', () => setLoading(false, dispatch))
  }

  return (
    <Layout className="layout">
      <RecaptchaContext.Provider value={recaptcha.current}>
        <Navigation />
        <Spin spinning={props.isLoading} tip="Loading...">
          <Content>
            {props.children}
            <ReCAPTCHA
              ref={recaptcha}
              sitekey={props.captchSiteKey}
              size="invisible"
            />
          </Content>
          <CartDrawer />
        </Spin>
      </RecaptchaContext.Provider>
    </Layout>
  )
}

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading,
    captchSiteKey: state.constants.CAPTCHA_SITE_KEY
  }
}

export default connect(mapStateToProps)(MainLayout)
